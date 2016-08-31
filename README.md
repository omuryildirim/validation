<h2>Validation</h2>
<p>Validation is jQuery based high compatible tool for checking any validation rule within HTML components.
As the world changes, validation can't wait too. With V3, validation creating becomes very easy. Now you can put validation tags to your inputs and then sit back and enjoy. There are two new way to create validations. First, put data-validation tags directly your input. Then call validation jQuery function in document ready. Second, select a form with jQuery selector and call validation jQuery function with your options as parameter.
</p>
<h2>Example</h2>
<p>
Validation works with a data tags and jQuery function call. All you must do to give your input a tag.
<br/>Here is a very basic Validation.
<br/><h4>Sample Email Input:</h4>
<div class="highlight highlight-text-html-basic">
  <pre>
    	&lt;div class=&quot;form-group&quot;&gt;&nbsp;
    	&nbsp; &nbsp; &lt;label&gt;Sample Email&lt;/label&gt;&nbsp;
    	&nbsp; &nbsp; &lt;div&gt;&nbsp;
    	&nbsp; &nbsp; &nbsp; &nbsp; &lt;input data-validation=&quot;email&quot; data-control=&quot;#emailFormSubmit&quot; type=&quot;email&quot; class=&quot;email input&quot; /&gt;&nbsp;
    	&nbsp; &nbsp; &lt;/div&gt;
    	&lt;/div&gt;
	</pre>
</div>
<h4>And simply call validation jQuery function:</h4>
<div class="highlight highlight-text-html-basic">
  <pre>
    <span>$(document).ready(function() {&nbsp;</span>
    <span>&nbsp;&nbsp;$("body").validation();&nbsp;</span>
    <span>});</span>
  </pre>
</div>
</p>
<h2>Documantation</h2>
<p>
  Example folder under version is a simple Documantation with many examples.

  For V2;
  You can use tool for <a target="_blank" href="http://ignorethedark.com/validation">Validation Object Creator</a>.
  For further information please visit <a target="_blank" href="http://ignorethedark.com/opensource">here</a>.
</p>
<h2>Licence</h2>
<p>
  This source file is free software, available under the following license:
  MIT license - http://ignorethedark.com/validation - https://github.com/omuryildirim/validationThe
  Copyright (c) 2016 Ömür Yıldırım

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</p>
