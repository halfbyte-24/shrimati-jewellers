# Database Contract

Expected relationships:

`parent_categories`
↓
`child_categories`
↓
`products`
↓
`product_images`

Use foreign keys:
- `child_categories.parent_category_id`
- `products.parent_category_id`
- `products.child_category_id`
- `product_images.product_id`

Ensure deletion rules are considered carefully. Prefer safe behavior such as preventing accidental deletion of categories that contain products.
