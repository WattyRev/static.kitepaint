# KitePaint Embedding

## Permissions

The only pages that will function within an iframe are the CreateNew, Edit, and View pages.

When embedding a valid KitePaint page, the hosting domain will be inspected. Each
product has a whitelist of allowed domains. To add your domain to a product's whitelist,
contact KitePaint at spencer@kitepaint.com.

Product whitelists are maintained at the discretion of the manufacturer. Domains will
not be added to the whitelist without the manufacturer's permission.

## Embedding URL

In most cases, you will want to embed the CreateNew page. The URL looks like this:

```
http://kitepaint.com/create/:productId
```

This is the same URL that you would use to create a new design for a product on KitePaint.com.

### Query Parameters

See [Query string article](https://en.wikipedia.org/wiki/Query_string) on Wikipedia

Some query parameters are supported for embedded use:

| Param Name   | Description                                                                                                                                                                                                                                                                                  | Example                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `css-url`    | Allows referencing a CSS file that will be added to the page. This allows you to modify the application's styling to better match your website. This parameter is provided for your convenience. Maintaining this CSS and ensuring it's functionality is not the responsiblity of KitePaint. | `//my-website.com/someStyles.css` |
| `background` | Allows providing a background image that can be used as the default background for the editor. KitePaint's background images may be used. A list of images is provided below.                                                                                                                | `//my-website.com/someImage.jpg`  |

Here is an example:

```
https://kitepaint.com/create/5?css-url=//my-website.com/test.css&background=//my-website.com/someImage.jpg
```

#### Background Images

- `//kitepaint.com/backgrounds/beach.jpg`
- `//kitepaint.com/backgrounds/blue-sky.jpg`
- `//kitepaint.com/backgrounds/dark-sky.jpg`
- `//kitepaint.com/backgrounds/orange-sky.jpg`
- `//kitepaint.com/backgrounds/grass.jpg`
- `//kitepaint.com/backgrounds/water.jpg`

## Using an Iframe

`iframe` is an HTML tag whose documentation can be found [here](https://www.w3schools.com/HTML/html_iframe.asp).

You can use an iframe to embed the KitePaint editor on a webpage. Here is an example:

```html
<iframe src="https://kitepaint.com/create/5" width="900px" height="1000px"
```
