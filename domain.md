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
    class Product {
        <<abstract>>

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
        -Array~Product~ products

        +addProduct(Product p)
        +checkout() Receipt
    }

    Cart --* Product

    class Receipt {
        -Array~Product~ products
        -number totalPrice
    }

    Receipt --* Product   

    note for Receipt "Class Invariants:
        products.length > 0
        totalPrice > 0
    "
```




