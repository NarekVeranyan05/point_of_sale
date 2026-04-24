title: An Assessment of The Point-of-Sale UI <br>
author: Narek Veranyan (veranyan@myumanitoba.ca) <br>
date: April 9, 2026

---

# Phase 1

Here's my entire UI for phase 1:

![phase_1_ui.png](public/phase_1_ui.png)

## Phase 1 visibility

My initial implementation of this UI was fairly visible because:

* :+1: All the actions that the user can do are immediately shown on the screen.
  The user may either add a product to a cart, or – after adding some – check out with the
  items selected.


* :+1: The action of checking out is disabled when the cart is empty but is still visible. When clicking on it, the system
will let the user know that they cannot make a purchase.

![phase_1_empty_cart.png](public/phase_1_empty_cart.png)

* :+1: Given the information on the screen, the user knows that they are in the browsing stage of interacting with the system.

## Phase 1 feedback

My initial implementation of this UI had adequate feedback:

* :+1: clicking the "Add to Cart" button shows as a response to the user that the item was successfully added
  to the cart – it displays the item information in a box to the right side of the screen, the cart panel, and
  it updates the counter for the number of items in the cart, shown in the cart badge.

![phase_1_product_added.png](public/phase_1_product_added.png)

* :+1: when the user attempts to check out with an empty cart, the UI clearly indicates with a red notification badge
  to the top-left side of the screen that a checkout cannot be made with an empty cart. The red colour scheme of
  the notification as opposed to the rest of the system clearly indicates, together with the actual message of the
  notification, that it is a negative feedback about something that went wrong.


* :-1: however, the negative feedback about an empty-cart checkout can be made clearer by
  telling the user that they need to add a product to be able to check out to make it more informative.

![phase_1_empty_cart.png](public/phase_1_empty_cart.png)
  
* :+1: when the user checks out with a non-empty cart, the checkout succeeds, and a receipt notification is shown in the
  top-left corner of the screen as feedback.

![phase_1_successful_checkout.png](public/phase_1_successful_checkout.png)


* In the context of phase 1, they were no long-running tasks.

## Phase 1 consistency

My initial implementation of this UI had average consistency:

* :+1: all the buttons consistently use labels
  

* :-1: but not all labels are verbs: the label for the button to check out is the noun "checkout" rather than the verb "check out."


* :+1: all buttons consistently do not have icons


* :+1: There are only 2 available operations, and they are similar in that they both involve a single button click. 


* There were no input fields in the context of phase 1


---

---

# Phase 2

Here are the major new parts of my interface for phase 2:

#### 1 - the login/signup screen is the first thing shown in the system now

![phase_2_login_signup.png](public/phase_2_login_signup.png)

#### 2 - the dialog for entering the quantity of that product to add to cart

![phase_2_product_amount_dialog.png](public/phase_2_product_amount_dialog.png)

#### 3 - the coupon selection for choosing coupon to apply to receipt upon purchase

![phase_2_coupon_selection_screen.png](public/phase_2_coupon_selection_screen.png)

#### 4 - the new notification for the receipt, including additional information

![phase_2_receipt.png](public/phase_2_receipt.png)

#### 5 - the main menu (transaction screen) UI submitted for phase 2:

![phase_2_transaction_screen.png](public/phase_2_transaction_screen.png)

## Changes from phase 1

* The main change made from phase 1 to phase 2 was that now the user has to log in or
  sign up to the system first, before getting to browse the catalogue and purchase products.


* The user is now prompted to enter a quantity of the selected product to be added to the cart.


* The user is now offered an option to select coupons to apply to the receipt upon purchase, so
  clicking on "checkout" button does not immediately proceed to purchasing the items.

## Phase 2 visibility

The visibility for phase 2 is good.

* :+1: At any time or context, all the possible actions are visible:
  * In the login/signup screen, the two input fields and two options for authentication are visible. It clearly shows what state the user at
    in the process of interacting with the system – it is the login stage only after which they may use the system. Also, the cursor is auto-focused on one of the input
    fields, making it clear that the user can enter text in that field.

  * The dialogue for product amount is visible. It has the cursor auto-focusing on the input field and giving a description of what the prompt is,
    making it clear to the user what stage they are at – describing how much of the selected item they want to add.

  * The selection screen for the coupons is visible since it shows the list of all available coupons, with
  buttons visible next to the corresponding coupon to add to the cart. The prompt at the top of the selection screen informs the user
  that they can skip adding coupons by simply clicking the "purchase" button, and the user clearly knows that they are at the final step of making
  a purchase.


* :-1: Since logging in to the system can take a long time, the login and signup buttons are disabled
  at the moment (as can be verified in `login-view.ts`). But it is not shown in the UI that the action is sometimes possible in the context but 
  currently disabled due to processing.

## Phase 2 feedback

Phase 2 feedback is overall good.

* :-1: Creating accounts takes noticeable amount of time, but the system does not communicate to the user that
  it is currently doing processing.


* :+1: Unsuccessful login or signup is notified to the user with an error notification. The error notification
  has a message reflecting the reason of the problem – empty name or password, incorrect password, etc. The user
  clearly knows what went wrong and how to fix it.

![phase_2_unsuccessful_login.png](public/phase_2_unsuccessful_login.png)
![phase_2_unsuccessful_login_signup.png](public/phase_2_unsuccessful_login_signup.png)
![phase_2_unsuccessful_signup.png](public/phase_2_unsuccessful_signup.png)


* :+1: Success in adding coupons to the cart is communicated to the user – the system immediately displays the new
  coupon in the cart panel, as well as removing that coupon from the selection screen.

  
* All the other UI elements remained the same in terms of feedback since phase 1. 

## Phase 2 consistency

The consistency in phase 2 is very good.

* :+1: All the buttons consistently use verbs as labels, and none of them has an icon.

* :+1: The flows of adding a product and adding a coupon are similar to each other – there is a list given to the user, 
with a description of each item, and the user has the option to add them to the cart.

* :+1: All the input fields have labels that help the user navigate through the system and know what they are being asked for provide –
the login screen tells the user to provide account name and password; product amount dialogue tells the user to provide quantity for
the selected product (in a certain measurement unit).

## How I might change my UI

* I would add a message with a loading spinner to the screen when the user attempts to log in or create a new account so
  that the user knows that the system is performing a long-running task but is functioning correctly.
* Also, I would grey out the login and signup buttons once clicked and while the system is processing authentication.

