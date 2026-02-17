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

```mermaid
classDiagram
    class Profile {
        -~string name
        -~Cart cart
        -Array~Receipt~ receipts
    }

    Profile "1" o--* "1" Cart
    Profile "1" o--* "*" Receipt

    class Product {
        <<abstract>>

        -~number id
        -~?Cart cart
        -~?Receipt receipt
        -string name
        -number price
    }

    note for Product "Class Invariants:
        price > 0
    "

    class Tracksuit { }

    Tracksuit --|> Product

    class RunningShoes { }

    RunningShoes --|> Product

    class Cart {
        -~number id
        -~Profile profile
        -Map~Product, number~ products
        -Array~Coupon~ coupons

        +addProduct(Product p, number amt)
        +addCoupon(Coupon c)
        +checkout() Receipt
    }

    Cart "1" o--* "*" Product

    class Receipt {
        -~number id
        -~Profile profile
        -Map~Product, number~ products
        -number discount
        -number totalPrice
    }

    Receipt "1" o--* "+" Product    

    note for Receipt "Class Invariants:
        products.length > 0
        totalPrice > 0
    "

    class Coupon {
        <<interface>>

        +applyCoupon(Cart c) 
    }

    class Discount { }
    Discount --|> Coupon

    class Bogo { }

    Bogo --|> Coupon
```




