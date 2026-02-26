---
title: Domain Model of the Point of Sale System
author: Narek Veranyan (veranyan@myumanitoba.ca)
date: January 18, 2026
---

## Domain Model

> Changes:
> * replaced the `ProductType` enumeration with TrackSuit and RunningShoes classes
> * turned Product into an abstract class
> * replaced aggregation between Cart-Product and 
>   Receipt-Product to composition due to implementation

* Note: the Account password is stored only in the database

```mermaid
classDiagram
class Account {
    -~string name
    -string password
    -Cart cart
    -Array~Receipt~ receipts
}

Account --* "1" Cart
Account "1" o--* "*" Receipt

note for Account"Class Invariants:
    name.length > 0
    password.length > 0
"

class Cart {
    -Array~Product~ products
    -Array~Coupon~ coupons
    
    +addProduct(Product p)
    +addCoupon(Coupon c)
    +checkout() Receipt
}

Cart "1" o--* "*" Product
Cart "1" o--* "*" Coupon

note for Cart "Class Invariants:
    if coupons.length > 0,<br> then products.length > 0
"

class Product {
    <<abstract>>
    
    -~number id
    -?Cart cart
    -?Receipt receipt
    -string name
    -string description
    -number price
    -number quantity
}

note for Product "Class Invariants:
    name.length > 0
    description.length > 0
    price > 0
    quantity > 0
"

class Tracksuit { }

Tracksuit --|> Product

class RunningShoes { }

RunningShoes --|> Product

class SunflowerSeed { }

SunflowerSeed --|> Product

class Receipt {
    -PlainDateTime timestamp
    -~number id
    -Account account
    -Array~Product~ products
    -number discount
    -number totalPrice
}

Receipt "1" o--* "+" Product

note for Receipt "Class Invariants:
    products.length > 0
    totalPrice > 0
"

class Coupon {
    <<abstract>>
    
    Cart cart
    string name
    string description
    
    applyCoupon(Receipt r)
}

note for Coupon"Class Invariants:
    name.length > 0
    description.length > 0
"

class Discount {
    number amountOff
}

note for Discount"Class Invariants:
    amountOff > 0
"

Discount --|> Coupon

class Bogo {
    Product reward
    Product toBuy
}

Bogo --|> Coupon
Bogo --o "1" Product
```




