# jquery.textareaheight.js

A jQuery plugin that allows you to automatically or using a bar expand the textarea to the height of the content
---

### Install with npm

```shell
npm i jquery.textareaheight.js
```

---

### Usage

HTML content:
```html
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="../dist/jquery.textareaheight.js"></script>
    <link rel="stylesheet" href="../dist/jquery.textareaheight.css" />
```

JavaScript:

```javascript
    $(function () {
        // Automatically expand the textarea to the height of the content
        $('textarea#comments').textareaheight({auto:true}); 

        // The height of the textarea will remain according to the style settings; it can be expanded using the bar
        $('textarea#comments').textareaheight({auto:false}); 
    })
```