<h2>Validation</h2>
<p>Validation is jQuery based high compatible tool for checking any validation rule within HTML components. 
Validation can be used for two main purpose. Check if a specific form input empty (on form submit) and 
check any detailed validation for an input (like email character check on keypress).
</p>
<h2>Example</h2>
<p>
Validation works with a JSON definings. All you must do to give your input information to Validation. 
<br/>Here is a very basic Validation object.
<br/><h4>Sample Email Input:</h4>
<div class="highlight highlight-text-html-basic">
  <pre>
    	&lt;div class=&quot;form-group&quot;&gt;&nbsp;
    	&nbsp; &nbsp; &lt;label&gt;Sample Email&lt;/label&gt;&nbsp;
    	&nbsp; &nbsp; &lt;div&gt;&nbsp;
    	&nbsp; &nbsp; &nbsp; &nbsp; &lt;input type=&quot;email&quot; class=&quot;email input&quot; /&gt;&nbsp;
    	&nbsp; &nbsp; &lt;/div&gt;
    	&lt;/div&gt;
	</pre>
</div>
<h4>Validation Object for Email Character Check on Keyup event:</h4>
<div class="highlight highlight-text-html-basic">
  <pre>
    <span>var validation = new validator();&nbsp;</span>
    <span>validation.addValidationObject(&quot;custom&quot;, {&nbsp;</span>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;keyup: {&nbsp;</span>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;.email&quot;: {&nbsp;</span>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rule: validation.checkEmail&nbsp;</span>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</span>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</span>
    <span>})&nbsp;</span>
    <span>validation.validate(&quot;change&quot;, &quot;custom&quot;);</span>
  </pre>
</div>
</p>
<h2>Documantation</h2>
<p>
  You can use tool for <a target="_blank" href="http://ignorethedark.com/validation">Validation Object Creator</a>.
  For further information please visit <a target="_blank" href="http://ignorethedark.com/opensource">here</a>.
</p>
