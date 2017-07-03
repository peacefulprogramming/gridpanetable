# Grid-Pane Table

Grid-Pane Table is a light-weight data table widget .

## Features

 + Uses only the pure table structure (table, caption, thead, tbody, tr, th, td) as a foundation.
 + Horizontal and Vertical Scrolling
 + Automatic Resizing
 + Does not depend on a pre-existing css framework, such as bootstrap
 + Customizable striping
 + Fixed left and right columns
 + Separately customizable header and row heights
 
 The following features will not be included because they are easily added by the user and are not general enough
 
 + Sorting - there are too many data types to include all of them in a widget. An example of how the user can contol sorting is shown in the example. 
 + Column Filtering - Similar to sorting, this is a custom function that depends on the data type of the column.
  + In-line editing - again there are too many data types  for all of them to be included in the widget. This can also be implemented by the user in the cell getter function.
 
Currently it is only available for React. An Angular version may be developed in the future.

## Installation and Usage

Only requires the gridpanetable.js and gridpanetable.css files included in this repository.

To use the component, include the following line in your code (or use JSX): 

	React.createElement(GridPaneTable.Table, options)

## API

### Table Options

+ caption - (optional) if included either `true` or a `caption` object. If true turns on the ability to hide columns. The `caption` object gives some more flexibility.
 + columns - (**required**) an array of `column`
 + evenClass, oddClass - (optional) a `String` value that gives the class name(s) for the even and/or odd row(s) (zero - indexed, *i.e.*, even starts first)
 + headerClass - (optional) Similaly a `String` value for the class used for the table header
 + headerRowHeight, rowHeight - (optional) heights for the table header and a generic row respectively. Either or both could be set.
 + numRows - (**required**)  the number of rows of data
 + minWidth - (optional) A `number` If set, the table will resize with the window down to the given width (in pixels). The table will attempt to fill its parent component, so it's parent component's width should probably be set in some way.  If the table is smaller than the sum of the columns, horizontal scrolling will automatically be enabled. If not set, the table will be a constant width that is the sum of the column widths.
 + verticalResizer - (optional) - a `VerticalResizer` object. If set enables vertical scrolling. If not set, all rows are visible, and the window is the scroller
 
 ### Caption
 
 + title - a `String` or React Element will be placed in the top center of the table
 
 ### Column
 
+ cellContentGetter - (**required**) a `function` to get a cell's content. The properties of the argument sent are described below.
+ referenceName, displayName (one is **required**) - Only one of these values is required. If one is missing, the other will be used. The difference is what is used by default for various purposes. The list of column options to turn on and off (if the caption is enabled) by default uses the `referenceName` property, so it is usually just a `String`. By contrast, the content of the header cell will default to the `displayName` property, so it could be a React Element. This is useful, where the header is complicated (*e.g.* to allow for sorting), but still want the ability turn it off or on.
+ width - (**required**) the minimum width of the column
+ fixed - (optional) a `boolean` that will fix the column on the left (in order). Can have multiple `fixed` left columns, but it is fragile if skipping one to the middle or on the right (see `fixedRight` below). Default is false.
+ fixedRight - (optional) a `boolean` that will fix a column on the right a best practice is probably to only have one of these, but consideration for RTL languages may be taken to account in the future. . . Default is false.
+ noHide - (optional) a `boolean` If set and the caption options are turned on, prevents hiding the given column. Default false
+ custom properties - (optional) all custom properties will be forwarded to the cellContentGetter function. Some custom properties, *e.g.*, might be the name of the property, if each row of data is an object, not an array, the formatter for the cell, whether the cell is editable, *etc.*

### ViewResizer

+ remainingHeight -  (optional) the vertical padding from the window height when calculating the table's height on resize. Useful if the table is not the only component on the page!
+ minHeight - (optional) the minimum height (in pixels) of the table even if the window size (minus `remainingHeight`) is smaller than it

### cellContentGetter argument properties

The cell getter should be a function of the format

`
	 function myCellGetter(arg) {
	 ...
	}
`

where `arg` has the following properties

+ rowIndex - the (zero-based) index of the table row
+ colIndex - the (zero-based) index of the table column
+ column - the `Column` object associated with table column




`