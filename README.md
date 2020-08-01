# MallardMenus
MallardMenus is a command line utility for generating stand-alone web resources for mobile optimized menus. Starting with a properly formatted spreadsheet, MallardMenus will generate HTML that allows you to customize and deploy it to the web host of your choice. The HTML template includes vanilla javascript that provides some convenience features for users.

This project is provided as-is and is geared towards the restaurant industry as it adapts to changes caused by the COVID-19 pandemic.

Run `node index.js` from the parser directory to generate a new HTML document based on the contents of the excel spreadsheet.

Run the menu directory in your dev server of choice to see an example based on the [Fat City](http://fatcitycafepdx.com) menu.

Running the Decent Less: Use the **index.less** file in /src/decent to output to the same all-styles.css target

## Spreadsheet formatting
Spreadsheets used to generate HTML resources must be structured corrently. Each sheet represents a section of the menu. Only one section will be visible at a time. Add an exclamation point to the name of the sheet to include it as a quick-link button in the drawer for the menu.

Each sheet should contain a list of records that correspond with items of content in the menu. The first column's value represents the type of content that the record represents.
 - title: a header that is defined by the value in the second column.
 - text: a paragraph that is defined by the value in the second column.
 - button: a button link that opens the section as defined by the value in the second column. The third column optionally defined the text to use on the button.
 - item: a menu item that derives its title from the value of the second column, a description paragraph from the second column, and a price from the value of the third column. 
