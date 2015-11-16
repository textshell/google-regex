# google-regex
Highlight and redirect sites in google search result pages.

This chrom(ium) extension allows adding site specific styles and redirection patterns into the google search result page.

To use this tool you need a basic understanding of CSS and javascript regular expressions.

Configuration is done via a page icon in google's search result pages. Configuration is text
based with with following syntax:

* Comments are lines starting with '#'
* Matching target urls begin with '^' and should include the protocol (e.g. http or https)
* CSS style properties are set with lines begining with "." followed by a single css property without ending semicolon
* Target Urls can be rewritten by lines starting with "!", regex caputure groups can be used with "$1" and so on.

Example:

The following example highlights the listed sites with a green background.
```
# High quality Communities
^http://\w+.wikipedia.org/
^http://stackoverflow.com/
^http://bugs.debian.org/
.background-color: #e0ffe0
.padding: 5px
```

An simple redirect could look like this
```
^http://forum.example.com/printview?t=(\d+)
!http://forum.example.com/thread?t=$1
```

