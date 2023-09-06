## Un-used CSS Checker
_Note: This is experimental software and it certainly contains bugs._

This cleaner will go through an array of strings, where each string is a CSS selector. This list of selectors can be extracted from any webpage by doing:

```javascript
const stylesheet = document.styleSheets[0]
const selectors = Array.prototype.map.call(stylesheet.cssRules,function(a) { return a.selectorText })
```

### Running
To run the cleaner, place the selectors in a file `all_css_classes.json` and run `node clean_classes.js`. The output will be a file `all_classes_cleaned.json`.


### Inspecting
Finally, we can use a tool such as [Ag](https://github.com/ggreer/the_silver_searcher) to go through a directory and search for usages, something like:

```javascript
const fs = require('fs')
const { execSync } = require('child_process')
const rules = require('./all_classes_cleaned.json')

function main() {
  const notFound = []

  rules.forEach(rule => {
    try {
      execSync(`cd ~/projects/my-project; ag --ignore "*.css" --case-sensitive --ruby --html --js -Q --literal -- '${rule}' ./;`)
    } catch (error) {
      notFound.push(rule)
      console.log(`No usages found for: ${rule}`, )
    }
  })

  fs.writeFileSync('./notFound.txt', notFound.join('\n'))
  console.log('Done')
}

main();
```

At this point, you have a candidate list of un-used CSS classes and IDs. Some manual verification is likely required.
