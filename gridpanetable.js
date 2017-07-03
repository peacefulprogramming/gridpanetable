/**
 *
 *   BS"D
 *   GridPaneTable data table component.
 */

var GridPaneTable = {};
GridPaneTable.DEFAULT_ROW_HEIGHT = 0;
GridPaneTable.WHITE_SPACE = "\u00a0";



GridPaneTable.Service = function () {
	this.header = null;
	this.body = null;
	
	this.setHeader = function(hdr) {
		this.header = hdr;
	}
	
	this.getHeader = function() {
		return this.header;
	}
	
	this.setBody = function(bdy) {
		this.body = bdy;
	}
	
	this.getBody = function() {
		return this.body;
	}
	
	this.onScroll = function(tbl, custom) {
		var header = this.getHeader();
		var body = this.getBody();
		var rect = header.getBoundingClientRect();
		var newLeft = 0 - body.scrollLeft;
		header.style.left = newLeft + "px";
  	 	var fixedColumns = tbl.getElementsByClassName("gridpanetable-cell-fixed");
  	 	for (var cc=0; cc<fixedColumns.length; cc++) {
  	 		var cell = fixedColumns[cc];
  	 		if (custom) {
  	 			cell.style.transform = "translate(" + body.scrollLeft + "px)";
  	 		}
  	 		else {
  	 			cell.style.transform = "";
  	 		}
  	 	}
  	 	fixedColumns = tbl.getElementsByClassName("gridpanetable-cell-fixed-right");
  	 	for (var cc=0; cc<fixedColumns.length; cc++) {
  	 		var cell = fixedColumns[cc];
  	 		if (custom) {
  	 			var transMove =  body.scrollLeft;
  	 			cell.style.transform = "translate(" + transMove + "px)";
  	 		}
  	 		else {
  	 			cell.style.transform = "";
  	 		}
  	 	}
	}
	
};

GridPaneTable.Cell = React.createClass({
  setElement: function(elt) {
  	  this.element = elt;
  },
  getCellClass: function () {
  	var clazz = "gridpanetable-cell";
  	if (this.props.custom) {
  		clazz = clazz + " gridpanetable-cell-scroll";
  		if (this.props.column.fixed) {
  	  		clazz = clazz + " gridpanetable-cell-fixed";
  		}
  		if (this.props.column.fixedRight) {
  	  		clazz = clazz + " gridpanetable-cell-fixed-right";
  	  	}
  	}
  	return clazz;
  },
  setStyles: function() {
  	  if (this.props.custom) {
  	  	this.element.style.width = "";
  	  	this.element.style.minWidth = this.props.column.width + "px";
  	  	this.element.style.maxWidth = this.props.column.width + "px";
  	  	if (!this.props.column.fixedRight) {
  	  		this.element.style.left = this.props.column.left + "px";
  	  	}
  	  	else {
  	  		this.element.style.left = "";
  	  		if (this.props.cellType.toUpperCase() == "TH") {
  	 			rect = this.element.getBoundingClientRect();
  	 			this.element.style.width = (rect.width + 10) + "px";
  	 			this.element.style.maxWidth = (rect.width + 10) + "px";
  	  		}
  	  	}
  	  }
  	  else {
  	  	this.element.style.minWidth = "";
 	  	this.element.style.transform = "";
 	  	this.element.style.maxWidth = "";
  	  	var w = this.props.totalWidth*this.props.column.width/this.props.defaultTotalWidth
  	  	this.element.style.minWidth = w + "px";
  	  }
  	  if (this.props.height>0) {
  	  	this.element.style.height = this.props.height + "px";
  	  }
  	  //if (this.props.column.transparent) {
  	  //	this.element.style.opacity = 0.5;
  	  //}
  },
  getCellContent: function() {
  	  if (this.props.cellType == "th") {
  	  	  return this.props.cellContent;
  	  }
  	  else {
  	  	  var arg = {
  	  	  	  rowIndex: this.props.rowIndex
  	  	  	  ,columnIndex: this.props.columnIndex
  	  	  	  ,column: this.props.column
  	  	  	  ,row: this.props.parentRow
  	  	  	  ,cell: this.element  	  	  	  
  	  	  }
  	  	  return this.props.cellContent(arg);
  	  }
  },
  componentDidMount: function() {
  	this.setStyles();
  },
  componentDidUpdate: function() {
  	this.setStyles();
  },
  render: function() {
  	  return (
  	  	  React.createElement(this.props.cellType, 
  	  	  	  {ref: this.setElement, className: this.getCellClass()},
  	  	  	  this.getCellContent()
  	  	  )
  	  )
  }
});

GridPaneTable.Row = React.createClass({
  createColumns: function() {
  	  var columns = [];
  	  for (var cc=0; cc<this.props.columns.length; cc++) {
  	  	var columnKey = "col" + cc;
  	  	var column = this.props.columns[cc];
  	  	var cellContent = null;
  	  	cellType = "";
  	  	if (this.props.isHeader) {
  	  		cellContent = GridPaneTable.WHITE_SPACE;
  	  		if (column.displayName) {
  	  			cellContent = column.displayName;
  	  		}
  	  		else {
  	  			cellContent = column.referenceName;
  	  		}
  	  		cellType = "th";
  	  	}
  	  	else {
  	  		//cellContent = column.cellContentGetter(this.props.rowIndex, cc, column);
  	  		cellContent = column.cellContentGetter;
  	  		cellType = "td";
  	  	}
  	  	if (column.fixedRight && column.display && this.props.custom) {
  	  		var cloneColumn = {
  	  			width: column.width,
  	  			left: column.left,
  	  			name: column.name,
  	  			property: column.property,
  	  			transparent: true
  	  		};
			columns.push(
			React.createElement(GridPaneTable.Cell,
						{key: columnKey + "H", cellType: cellType, height: this.props.height,
							rowParent: this.element, columnIndex: cc, rowIndex: this.props.rowIndex,
							cellContent: cellContent, column: cloneColumn, custom: this.props.custom,
							defaultTotalWidth: this.props.defaultWidth, totalWidth: this.props.width},
						null
					)
			);
  	  	}
  	  	if (column.display) {
		   columns.push(
		   React.createElement(GridPaneTable.Cell,
					{key: columnKey, cellType: cellType, height: this.props.height,
						rowParent: this.element, columnIndex: cc, rowIndex: this.props.rowIndex,
						cellContent: cellContent, column: column, custom: this.props.custom,
						defaultTotalWidth: this.props.defaultWidth, totalWidth: this.props.width},
					null
				)
		   );
  	  	}
  	  }
  	  return columns;
  },
  setElement: function(elt) {
  	this.element = elt;
  },
  setStyles: function () {
  	if (this.props.height>0) {
  		this.element.style.height = this.props.height + "px";
  	}
  	if (this.props.custom) {
  		this.element.style.width = "";
  	}
  	else {
  		//This not *Yet* available size - it is set to sum of columns to get correct %age
  		//this.element.style.width = this.props.totalWidth + "px";
  		this.element.style.width = "100%";
  	}
  },
  componentDidMount: function() {
  	this.setStyles();
  },
  componentDidUpdate: function() {
  	this.setStyles();
  },
  render: function() {
  	  return (
  	  	  React.createElement("tr", {ref: this.setElement, className: this.props.rowClass}, this.createColumns())
  	  )
  }
});

GridPaneTable.Body = React.createClass({
	getBodyClass: function() {
		var clazz = "gridpanetable-body";
		if (this.state.custom) {
			clazz += " gridpanetable-body-scroll";
		}
		return clazz;
	},
	getInitialState: function () {
		return {custom: true}
	},
	setVScroll: function (elt) {
		this.element = elt;
		this.props.service.setBody(elt);
	},
   createRows: function(custom) {
  	  var rows = [];
  	  var rr = 0;
  	  var columns = this.props.columns;
	  var props = this.props.rowProps;
  	  for (var rr=0; rr<props.numRows; rr++) {
  	  	var rowClass = props.rowClass;
  	  	if (props.evenClass && props.evenClass!=null && props.evenClass.length>0 && ((rr % 2) == 0)) {
  	  		rowClass = rowClass + " " + props.evenClass;
  	  	}
  	  	if (props.oddClass && props.oddClass!=null && props.oddClass.length>0 && ((rr % 2) == 1)) {
  	  		rowClass = rowClass + " " + props.oddClass;
  	  	}
  	   rows.push(
  	      	  React.createElement(GridPaneTable.Row,
  	      	  	  {columns: columns, key: "row" + rr, rowIndex: rr, height: props.rowHeight, 
  	      	  	  rowClass: rowClass, custom: this.state.custom,
  	      	  	  defaultWidth: this.state.defaultWidth, width: this.state.width},
  	      	  	  null
  	      	  )
  	   );
  	  }
  	  return rows;
   },
  componentDidMount: function () {
  		if (this.props.height>0) {
  			this.element.style.height = this.props.height + "px";
  		}
  },
  render: function () {
		return (
			React.createElement("tbody", {ref: this.setVScroll, className: this.getBodyClass()}, this.createRows(this.state.custom))
		)
	}
});

GridPaneTable.Header = React.createClass({
	getInitialState: function () {
		return {custom: true}
	},
   setElement: function(elt) {
  		this.element = elt;
  		this.props.service.setHeader(elt);
   },
	getHeaderClass: function() {
		var clazz = "gridpanetable-head";
		if (this.state.custom) {
			clazz += " gridpanetable-head-scroll";
		}
		return clazz;
	},
	render: function () {
		return (
  	   	React.createElement("thead", {className: this.getHeaderClass(), ref: this.setElement}, 
				React.createElement(GridPaneTable.Row,
					{columns: this.props.columns, height: this.props.height, rowClass: this.props.headerClass,
					isHeader: true,
					 custom: this.state.custom, defaultWidth: this.state.defaultWidth, width: this.state.width}, null
				)
  	      )
		)
	}
});

GridPaneTable.ColumnOption = React.createClass({
	getDisplayName: function() {
		if (this.props.column.referenceName) {
			return this.props.column.referenceName;
		}
		else {
			return this.props.column.displayName;
		}
	},
	getLabelClass: function() {
		var clazz = "";
		if (this.props.column.noHide) {
			clazz = "gridpanetable-disabled";
		}
		return clazz;
	},
	componentDidMount: function() {
		if (this.props.column.display) {
			this.element.checked = true;
		}
    },
  	setElement: function(elt) {
  	  this.element = elt;
  	},
  	handleChange: function() {
  		var chk = this.element.checked;
  		this.props.gpTable.updateColumn(this.props.columnIndex, chk);
  	},
    render: function() {
    	return (
    		React.createElement("div", {className: "gridpanetable-option"}, 
    			React.createElement("input", {type: "checkbox", ref: this.setElement
    				,disabled: this.props.column.noHide
    				,onChange: this.handleChange}, null)
    			,GridPaneTable.WHITE_SPACE
    			,React.createElement("span", {className: this.getLabelClass()}
    				,this.getDisplayName())
    		)
    	)
    }
});


GridPaneTable.OptionsLink = React.createClass({
	getInitialState: function() {
		this.props.gpTable.optionsLink = this;
		return {optionsDisplayed: "none"};
	},
	showOptions: function(evt, evtArg) {
		var optionsState = this.state.optionsDisplayed;
		if (optionsState == "none") {
			optionsState = "block";
		}
		else {
			optionsState = "none";
		}
		this.setState({optionsDisplayed: optionsState, 
			otionsRight: evt.clientX, optionsTop: evt.clientY});
	},
	moveOptions: function(newRight) {
		var optionsState = this.state.optionsDisplayed;
		if (this.state.optionsDisplayed == "block") {
			this.setState({optionsDisplayed: optionsState, 
				otionsRight: newRight, optionsTop: this.state.optionsTop});
		}
	},
	setOptionsDisplay: function(elt) {
		this.optionsDisplay = elt;
	},
	createColumnOptions: function() {
		var columnOptions = [];
		for (var cc=0; cc<this.props.columns.length; cc++) {
			var columnOption = React.createElement(GridPaneTable.ColumnOption,
				{key: "colOpt" + cc
				,column: this.props.columns[cc], columnIndex: cc
				,gpTable: this.props.gpTable}
				,null);
			columnOptions.push(columnOption);
		}
		return columnOptions;
	},
	componentDidUpdate: function() {
		this.optionsDisplay.style.display = this.state.optionsDisplayed;
		var rect = this.optionsDisplay.getBoundingClientRect();
		if (this.state.optionsDisplayed == "block") {
			this.optionsDisplay.style.left = (this.state.otionsRight - rect.width) + "px";
		}
	},
    render: function() {
    	return (
    		React.createElement("span", {},
    			React.createElement("span", {onClick: this.showOptions, className: "gridpanetable-options-link"}, "⚙")
    			,React.createElement("div", {className: "gridpanetable-options", ref: this.setOptionsDisplay},
    				this.createColumnOptions()
    			)
    		)
    	)
    }
});

GridPaneTable.Caption = React.createClass({
	render: function() {
		return (
  	  		React.createElement("caption", {className: "gridpanetable-caption"},
  	  			React.createElement("div", {className: "gridpanetable-caption-left"}, GridPaneTable.WHITE_SPACE)
  	  			,React.createElement("div", {className: "gridpanetable-caption-center"}, this.props.title)
  	  			,React.createElement("div", {className: "gridpanetable-caption-right"}, 
  	  				React.createElement(GridPaneTable.OptionsLink, 
  	  					{columns: this.props.columns, gpTable: this.props.gpTable}, null)
  	  			)
  	  		)
		)
	}
});

GridPaneTable.Table = React.createClass({
  getColumnPositions: function() {
	  this.maxWidth = 0;
  	  for (var cc=0; cc<this.columns.length; cc++) {
  	  		var column = this.columns[cc];
  	  		column.left = this.maxWidth;
  	  		if (column.display) {
  	  			this.maxWidth += column.width;
  	  		}
  	  }
  	  // This should prevent an infinite loop! . . .
  	  this.colIndex = null;
  	  // Because this will reset the state, and this was caused by resetting
  	  // the colIndex state!!!
  	  this.resize(this, this.element);
  },
  getInitialState: function () {
	  this.service = new GridPaneTable.Service();
	  this.maxHeight = this.props.rowHeight * this.props.numRows;
  	  this.columns = [];
	  this.maxWidth = 0;
	  this.optionsLink = null;
  	  for (var cc=0; cc<this.props.columns.length; cc++) {
  	  		var column = this.props.columns[cc];
  	  		var cloneColumn = {
  	  			left: this.maxWidth, display: true
  	  		};
  	  		for (p in column) {
  	  			cloneColumn[p] = column[p];
  	  		}
  	  		this.columns.push(cloneColumn);
  	  		if (cloneColumn.display) {
  	  			this.maxWidth += column.width;
  	  		}
  	  }
  	  return {custom: true};
  },
  setHeader: function (elt) {
  	this.header = elt;
  },
  createRowProps: function(custom) {
  	  var rowProps = {};
  	  var rr = 0;
  	  rowProps.numRows = this.props.numRows;
	  rowProps.rowHeight = GridPaneTable.DEFAULT_ROW_HEIGHT;
	  if (this.props.rowHeight) {
			rowProps.rowHeight = this.props.rowHeight;
	  }
  	  rowProps.rowClass = "gridpanetable-row-default";
  	  var props = this.props;
  	  if (props.evenClass && props.evenClass!=null && props.evenClass.length>0) {
  	  		rowProps.evenClass = props.evenClass;
  	  }
  	  if (props.oddClass && props.oddClass!=null && props.oddClass.length>0) {
  	  		rowProps.oddClass = props.oddClass;
  	  }
  	  return rowProps;
  },
  setBody: function (elt) {
  	this.body = elt;
  },
  createCaption: function() {
  	  if (this.props.caption) {
  	  	  var captionProps = {title: GridPaneTable.WHITE_SPACE, 
  	  	  	gpTable: this, columns: this.columns};
  	  	  if (this.props.caption.title) {
  	  	  	  captionProps.title = this.props.caption.title;
  	  	  }
  	  	  return React.createElement(GridPaneTable.Caption, captionProps, null)
  	  }
  	  else {
  	  	  return null;
  	  }
  },
  createHeader: function () {
		var rowHeight = GridPaneTable.DEFAULT_ROW_HEIGHT;
		var headerClass = "gridpanetable-header-default";
		if (this.props.headerRowHeight) {
			rowHeight = this.props.headerRowHeight;
		}
		if (this.props.headerClass && this.props.headerClass!=null  && this.props.headerClass.length>0) {
			headerClass = this.props.headerClass;
		}
  	  	return React.createElement(GridPaneTable.Header, 
  	  		{columns: this.columns, service: this.service, height: rowHeight, headerClass: headerClass, ref: this.setHeader}, null)
  },
  setElement: function(elt) {
  	  this.element = elt;
  },
  componentWillUpdate: function() {
  	  if (this.colIndex!=null && this.colIndex > -1) {
  	  	  this.columns[this.colIndex].display = this.newDisplay;
  	  	  this.getColumnPositions();
  	  }
  },
  updateColumn: function(colIndex, newDisplay) {
  	  this.colIndex = colIndex;
  	  this.newDisplay = newDisplay;
  	  this.setState({colIndex: colIndex, newDisplay: newDisplay});
  },
  resize: function(me, element, isResizeEvent) {
  	me.header.setState({custom: true});
  	me.body.setState({custom: true});
  	var body = me.service.getBody();
  	var header = me.service.getHeader();
  	var maxWidth = me.maxWidth + 15;
  	if (me.props.minWidth && me.props.minWidth!=null && me.props.minWidth>0) {
  		me.element.style.width = me.props.minWidth + "px";
  	}
  	else {
  		me.element.style.width = maxWidth + "px";
  	}
  	var pRect = me.element.parentElement.getBoundingClientRect();
  	var custom = true;
  	var currentWidth = pRect.width;
  	//if (!isResizeEvent) {
  	  	currentWidth = pRect.width - 64;
  	//}
  	if (pRect.width > maxWidth) {
  		custom = false;
  		if (me.props.minWidth && me.props.minWidth!=null && me.props.minWidth>0) {
			me.element.style.width = currentWidth + "px";
		}
 	  	//me.element.style.width = this.maxWidth + "px";
 	  	header.style.width = "";
  	}
  	else {
  		if (me.props.minWidth && me.props.minWidth!=null && me.props.minWidth>0) {
			me.element.style.width = me.props.minWidth + "px";
			if (pRect.width > me.props.minWidth) {
				me.element.style.width = pRect.width + "px";
			}
		}
  	}
  	if (me.props.tableHeight && me.props.tableHeight!=null && me.props.tableHeight>0) {
  	  	body.style.height = (me.props.tableHeight - me.headerRowHeight) + "px";
  	}
  	else {
  		if (me.vertResizer) {
  	 		var tbl = me.element;
    		var wHeight = window.innerHeight;
    		var maxHeight = wHeight - (pRect.top + me.vertResizer.remainingHeight);
    		if (maxHeight < me.vertResizer.minHeight) {
    				maxHeight = me.vertResizer.minHeight;
    		}
  	  		body.style.height = (maxHeight - me.headerRowHeight) + "px";
  		}
  	}
  	me.setState({custom: custom});
  	me.header.setState({custom: custom, defaultWidth: me.maxWidth, width: currentWidth});
  	me.body.setState({custom: custom, defaultWidth: me.maxWidth, width: currentWidth});
  	if (me.optionsLink && me.optionsLink!=null) {
  		me.optionsLink.moveOptions(pRect.right - 16);
  	}
  	me.service.onScroll(me.element, custom);
  	  
  },
  render: function() {
  	  return (
  	  	React.createElement("table", {ref: this.setElement, className: "gridpanetable-table"},
  	  		this.createCaption()
  	  		,this.createHeader()
  	      ,React.createElement(GridPaneTable.Body, {rowProps: this.createRowProps(), columns: this.columns,
  	       service: this.service, ref: this.setBody}, null)
   	)
  	  )
  },
  componentDidMount: function() {
  	  var me = this;
  	  var elt = this.element;
  	  this.resizeMe = function() {
  	  	me.resize(me, elt, true);
  	  }
  	  this.scrollMe = function () {
  	  	me.service.onScroll(me.element, me.state.custom);
  	  }
  	  window.addEventListener("resize", this.resizeMe);
  	  var body = this.service.getBody();
  	  this.headerRowHeight = 25;
  	  if (this.props.caption) {
  	  	  this.headerRowHeight = 50;
  	  }
  	  if (this.props.headerRowHeight && this.props.headerRowHeight>0) {
  	  	this.headerRowHeight = this.props.headerRowHeight;
  	  }
  	  if (this.props.tableHeight && this.props.tableHeight!=null && this.props.tableHeight>0) {
  	  	body.style.height = (this.props.tableHeight - this.headerRowHeight) + "px";
  	  }
  	  else {
  	  	if (this.props.verticalResizer && this.props.verticalResizer!=null) {
  	  		this.vertResizer = this.props.verticalResizer;
  	  	}
  	  }
  	  body.addEventListener("scroll",this.scrollMe);
  	  this.resizeMe();
  },
  conponentWillUnmount: function () {
  	window.removeEventListener("resize", this.resizeMe);
  }
});