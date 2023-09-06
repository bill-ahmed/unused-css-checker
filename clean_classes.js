const fs = require('fs')
const classes = require('./all_css_classes.json')

function cleanRule(rule) {
  if (!rule) return ""

  if (rule.startsWith('.') || rule.startsWith('#')) {
    rule = rule.slice(1)
  }

  rule = rule.replaceAll('>', '')
  rule = rule.replaceAll(',', '')
  rule = rule.replaceAll('+', '')
  rule = rule.replaceAll('~', '')
  rule = rule.replaceAll('*', '')
  rule = rule.replaceAll('  ', ' ')

  rule = rule.replaceAll('::before', '')
  rule = rule.replaceAll('::after', '')
  rule = rule.replaceAll(':hover', '')
  rule = rule.replaceAll(':focus', '')
  rule = rule.replaceAll(':checked', '')
  rule = rule.replaceAll(':empty', '')
  rule = rule.replaceAll(':active', '')
  rule = rule.replaceAll(':link', '')
  rule = rule.replaceAll(':visited', '')

  rule = rule.replaceAll(':indeterminate', '')

  rule = rule.replaceAll(':first-child', '')
  rule = rule.replaceAll(':last-child', '')


  rule = rule.replace(/\[\w+\]/g, '')

  rule = rule.replace(/:not\(.*\)/g, '')
  rule = rule.replace(/:nth-child\(.*\)/g, '')
  rule = rule.replace(/:nth-of-type\(.*\)/g, '')
  rule = rule.replace(/::-webkit-\w+(-\w+)?(-\w+)?/g, '')

  return rule
}

function cleanCSS(listOfClasses, seperator=/\s(\.)?/) {
  const resultSet = new Set()

  listOfClasses.forEach(rule => {
    if (!rule) return
  
    let newRules = rule;
  
    newRules = cleanRule(newRules)
    newRules = rule.split(seperator)  // How each class is split from the next in a rule    
  
    newRules.forEach(newRule => {
      newRule = cleanRule(newRule)
      resultSet.add(newRule)
    })
  })

  return resultSet
}

/**
 * Run it twice, using different separators.
 * Could probably be done in a single run, but
 * my Regex skill is hot garbage.
 */
let resultSet = cleanCSS(classes)
resultSet = cleanCSS([...resultSet], /\./)
resultSet = cleanCSS([...resultSet], '#')



const result = [...resultSet].sort()
fs.writeFileSync('./all_classes_cleaned.json', JSON.stringify(result, null, 1))
console.log(`Done. Found ${result.length} unique classes/ids`)