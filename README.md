---
title: Overall Project and Markov Model Description
date: April 24, 2026
author: Narek Veranyan
---

# Vision Statement

This project implements a point-of-sale (POS) system that enables cashier authentication (sign-up and login), product selection, coupon application, and cart management. The customer can complete checkout and generate a purchase receipt.

---

# How to Start the Program

To launch the application, execute the following commands in the terminal:

* `npm install`
* `npx vite`
* Open the local URL displayed in the terminal output

---

# How to Train the Model

To train the Markov model (i.e., run the training pipeline), open a terminal in the project root directory and execute:

```bash
npm run train:markov
```

---

# Training Results

The output of the training process is stored in:

```
./src/model/assets/markov-model/markov-model.csv
```

The CSV file should be interpreted as follows:

* The first 10 rows represent a transition count matrix (adjacency matrix), where entry *(i, j)* corresponds to the number of observed transitions from state *i* to state *j*.

* Immediately following the matrix is a row vector representing the total number of transitions originating from each state. For each row *i*, the sum of all entries in row *i* of the adjacency matrix equals the corresponding value in this vector.

* Each row corresponds to a product state, mapped as follows:

  * Row 0 (a): "Gary's Tracks"
  * Row 1 (b): "The Gopnik"
  * Row 2 (c): "Greta's Runners"
  * Row 3 (d): "Seeds of Doubt"
  * Row 4 (e): "The Harevan"
  * Row 5 (f): "The Hopar"
  * Row 6 (g): "Dad's Slippers"
  * Row 7 (h): "Lada Station Slippers"
  * Row 8 (i): "Ararat Slippers"
  * Row 9 (j): "Tatik's Pickled Everything"

---
