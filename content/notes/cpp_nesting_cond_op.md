---
title: C++ Nesting Conditional Operations
draft: false
tags:
  - notes
---
 
I swear I used to get so confused about these stupid things.
Just creating a page here in case I ever need to use them.

```cpp
string finalgrade = (grade < 60) ? "fail" : "pass";

finalgrade = (grade > 90) ? "high pass" : (grade<60) ? "fail" : "pass";
```

>[!warning] Nested conditionals quickly become unreadable. It's a good idea to nest no more than two or three.
>Yeah no shit..

