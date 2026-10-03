# Product Fields

## Required
- `product_name` (string)
- `slug` (string, unique)
- `parent_category_id` (uuid)
- `child_category_id` (uuid)

## Optional
- `product_code` (string)
- `description` (text)
- `collection_name` (string)
- `design_name` (string)
- `finish` (string)
- `purity` (string, e.g., 22K)
- `weight_value` (numeric)
- `weight_unit` (string, e.g., g)
- `huid` (string)
- `price` (numeric)
- `price_type` (string, e.g., 'Price on Request', 'Approx. Price')
- `is_available` (boolean, default true)
- `is_published` (boolean, default false)
- `is_featured` (boolean, default false)
- `display_order` (integer)
- `images` (handled via `product_images` table)
