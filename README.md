---
title: Markov Model Description
date: April 9, 2026
author: Narek Veranyan
---

# How to train the model

In order to train the model (i.e. run the training program), open the terminal at the root directory for the project
and type the following command:
```
npm run train:markov
```

# Training results

The output of the training program is in the `markov-model.csv` file, found in `./src/model/assets/markov-model`. The csv file is
to be interpreted as follows:
* the first ten rows comprise the adjacency matrix that reflects the number of times a transition from i-th row to the
j-th column has occurred.

* below the matrix, there is a row vector comprising the number of times a transition happened from the i-th row. Observe 
that the sum of the entries in each row in the adjacency matrix is equal to the corresponding entry in this vector.

* The products associated with each row are the following:
 - row 0: letter a:     "Gary's Tracks",
 - row 1: letter b:     "The Gopnik",
 - row 2: letter c:     "Greta's Runners",
 - row 3: letter d:     "Seeds of Doubt",
 - row 4: letter e:     "The Harevan",
 - row 5: letter f:     "The Hopar",
 - row 6: letter g:     "Dad's Slippers",
 - row 7: letter h:     "Lada Station Slippers",
 - row 8: letter i:     "Ararat Slippers",
 - row 9: letter j:     "Tatik's Pickled Everything" 