# Split Even

An offline shared-expense calculator written in JavaScript. Enter what each person paid and get a list of transfers that settles an equal split.

Download the repository ZIP, extract it, then double-click **index.html**. The example starts with Noa paying $48, Sam paying $12, and Alex paying $0. Each owes $20, so Sam pays Noa $8 and Alex pays Noa $20.

The calculator uses integer cents. When a bill cannot split evenly, the first people listed take one extra cent each until the remainder is assigned. Names and payments stay in the current tab.

Run the arithmetic checks with Node.js 20 or newer:

```sh
node --test settle.test.cjs
```
