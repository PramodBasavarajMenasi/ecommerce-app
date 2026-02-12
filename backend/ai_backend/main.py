import os
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import json
import re
load_dotenv()
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenRouter model
llm = ChatOpenAI(
    model="openrouter/aurora-alpha",
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=os.environ["OPENROUTER_API_KEY"],
)
# Request Schemas
class ProductItem(BaseModel):
    product_name: str
    quantity: int
    unit_price: float


# User
class UserOrderRequest(BaseModel):
    name: str
    email: EmailStr
    items: List[ProductItem]
    brand_name: str
#admin
class AdminOrderRequest(BaseModel):
    brand_name: str
    name: str
    email: EmailStr
    address: str
    items: List[ProductItem]

# Utility Function
def format_items(items: List[ProductItem]):
    lines = []
    total = 0

    for item in items:
        subtotal = item.quantity * item.unit_price
        total += subtotal
        lines.append(
            f"{item.product_name} | Qty: {item.quantity} | "
            f"Unit: ₹{item.unit_price} | Subtotal: ₹{subtotal}"
        )

    return "\n".join(lines), total

class ProductCatalogItem(BaseModel):
    product_id: int
    title: str
    category: str
    gender: str
    price: float


class PurchaseHistoryItem(BaseModel):
    product_id: int
    title: str
    category: str
    unit_price: float

class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    age: int
    gender: str
    state: str
    country: str
    products: List[ProductCatalogItem]

class CreateUserWithHistoryRequest(BaseModel):
    name: str
    email: EmailStr
    age: int
    gender: str
    state: str
    country: str
    purchase_history: List[PurchaseHistoryItem]
    products: List[ProductCatalogItem]

def build_prompt(age, gender, state, country, products, purchase_history):

    filtered_products = [
        p for p in products
        if p.gender.lower() == gender.lower()
    ]

    product_text = "\n".join([
        f"{p.title} | Category: {p.category} | Price: ₹{p.price}"
        for p in filtered_products
    ])

    history_text = "\n".join([
        f"{h.title} | Category: {h.category} | Price: ₹{h.unit_price}"
        for h in purchase_history
    ]) if purchase_history else "No purchase history."

    prompt = f"""
    You are an intelligent ecommerce recommendation engine.

    User Profile:
    Age: {age}
    Gender: {gender}
    State: {state}
    Country: {country}

    Purchase History:
    {history_text}

    Available Products:
    {product_text}

    Instructions:
- Recommend up to 10 most relevant products.
- Do NOT exceed the number of Available Products.
- If fewer than 10 products are available, return all the available products.
- Prioritize gender suitability.
- Adjust recommendations based on age group:
    * 15-25: trendy, youth fashion, modern styles
    * 26-40: balanced fashion, professional & casual mix
    * 41+: elegant, premium, traditional, comfort-focused
- Consider cultural relevance based on country.
- Consider regional suitability based on state.
- Match categories with purchase history.
- Consider similar price range.
- Sort from most relevant to least relevant.
- Return JSON only.
- No explanation.
- No markdown.

    Return format:

    {{
      "recommended_titles": ["Product1", "Product2", "Product3", "Product4", "Product5", "Product6","Product7","Product8","Product9","Product10"]
    }}
    """

    return prompt



# ADMIN EMAIL API
@app.post("/generate-admin-email")
async def generate_admin_email(order: AdminOrderRequest):

    items_text, total = format_items(order.items)

    prompt = f"""
    Generate a professional internal new order notification email for the store operations team.

    Strict Rules:
    - Do not use placeholders.
    - Do not use brackets.
    - Do not add explanations.
    - Do not use markdown formatting.
    - Include a clear subject line at the top.
    - Maintain formal business tone.
    - Focus on operational action.

    Store Name: {order.brand_name}

    New Order Details:

    Customer Name: {order.name}
    Customer Email: {order.email}
    Shipping Address: {order.address}

    Ordered Items:
    {items_text}

    Total Order Value: ₹{total}

    The email must:
    - Clearly state that a new order has been received.
    - Instruct the team to begin order processing.
    - Mention packing and shipment preparation.
    - Be structured and concise.

    Generate the complete internal email now.
    """

    response = llm.invoke([HumanMessage(content=prompt)])

    return {
        "admin_email": response.content,
        "total_amount": total
    }


# USER EMAIL API

@app.post("/generate-user-email")
async def generate_user_email(order: UserOrderRequest):

    items_text, total = format_items(order.items)

    prompt = f"""
    Generate a standard ecommerce order confirmation email.

    Store Name: {order.brand_name}

    Strict Rules:
    - Never use placeholders.
    - Never write text inside brackets.
    - Do not invent store names.
    - Do not use example domains.
    - Do not add explanations.
    - Do not use markdown.
    - Include a subject line.
    - Keep tone professional and friendly.

    Customer Name: {order.name}

    Order Summary:
    {items_text}

    Total Amount Paid: ₹{total}

    The email must:
    - Confirm that the order is successfully placed.
    - Mention the order is being prepared.
    - Provide estimated delivery time of 3-5 business days.
    - Thank the customer.
    - Include the support email provided above.

    Generate the complete email now.
    """

    response = llm.invoke([HumanMessage(content=prompt)])

    return {
        "user_email": response.content,
        "total_amount": total
    }

@app.post("/recommend-user")
async def create_user(user: CreateUserRequest):

    prompt = build_prompt(
        user.age,
        user.gender,
        user.state,
        user.country,
        user.products,
        []
    )

    response = llm.invoke([HumanMessage(content=prompt)])

    raw_output = response.content.strip()

    match = re.search(r"\{.*\}", raw_output, re.DOTALL)

    if not match:
        return {
            "error": "No valid JSON found in LLM response",
            "raw_output": raw_output
        }

    try:
        llm_result = json.loads(match.group())
    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON format from LLM",
            "raw_output": raw_output
        }

    #ID MAPPING SECTION

    # Create title -> product mapping
    title_to_product = {
        p.title: p
        for p in user.products  # IMPORTANT: use products from request
    }

    recommended_products = []

    for title in llm_result.get("recommended_titles", []):
        if title in title_to_product:
            product = title_to_product[title]
            recommended_products.append({
                "product_id": product.product_id,
                "title": product.title
            })

    return {
        "recommended_products": recommended_products
    }


@app.post("/recommend-user-with-history")
async def create_user_with_history(user: CreateUserWithHistoryRequest):

    prompt = build_prompt(
        user.age,
        user.gender,
        user.state,
        user.country,
        user.products,
        user.purchase_history
    )

    response = llm.invoke([HumanMessage(content=prompt)])

    raw_output = response.content.strip()

    match = re.search(r"\{.*\}", raw_output, re.DOTALL)

    if not match:
        return {
            "error": "No valid JSON found in LLM response",
            "raw_output": raw_output
        }

    try:
        llm_result = json.loads(match.group())
    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON format from LLM",
            "raw_output": raw_output
        }

    # ID MAPPING SECTION (NEW)

    # Create title -> product mapping
    title_to_product = {
        p.title: p
        for p in user.products  # IMPORTANT: use products from request
    }

    recommended_products = []

    for title in llm_result.get("recommended_titles", []):
        if title in title_to_product:
            product = title_to_product[title]
            recommended_products.append({
                "product_id": product.product_id,
                "title": product.title
            })

    return {
        "recommended_products": recommended_products
    }

