/**
 *
 *   BS"D
 *   GridPaneTable data table component.
 */


var GridPaneTable = function() {};
GridPaneTable.DEFAULT_ROW_HEIGHT = 0;
GridPaneTable.WHITE_SPACE = "\u00a0";


class GridPaneTableService {

	constructor() {
		this.header = null;
		this.body = null;
	}

	setHeader(hdr) {
		this.header = hdr;
	}

	getHeader() {
		return this.header;
	}

	setBody(bdy) {
		this.body = bdy;
	}

	getBody() {
		return this.body;
	}

	onScroll(tbl, custom) {
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

}

class GridPaneTableCell extends React.Component {
  constructor(props) {
	super(props);
  }
  setElement(elt) {
  	  this.element = elt;
  }
  getCellClass() {
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
  }
  setStyles() {
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
		 			var rect = this.element.getBoundingClientRect();
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
  }
  getCellContent() {
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
  }
  componentDidMount() {
  	this.setStyles();
  }
  componentDidUpdate() {
  	this.setStyles();
  }
  onCellClick(evt) {
	  if (this.props.column.onCellClick && this.props.column.onCellClick!=null) {
		  var arg = {
			  rowIndex: this.props.rowIndex,
			  columnIndex: this.props.columnIndex,
			  cell: this.element
		  };
		  this.props.column.onCellClick(arg);
	  }
  } 
  render() {
	var cell = this;
	return React.createElement(this.props.cellType,
		{ref: function(elt) { cell.setElement(elt); },
		onClick: function(evt)  { return cell.onCellClick(evt); },
		className: this.getCellClass()},
  		this.getCellContent());
  }
}

class GridPaneTableRow extends React.Component {
  createColumns() {
  	  var columns = [];
  	  for (var cc=0; cc<this.props.columns.length; cc++) {
  	  	var columnKey = "col" + cc;
  	  	var column = this.props.columns[cc];
  	  	var cellContent = null;
  	  	var cellType = "";
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
				onCellClick: column.onCellClick,	
  	  			transparent: true
  	  		};
			columns.push(
			React.createElement(GridPaneTableCell,
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
		   React.createElement(GridPaneTableCell,
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
  }
  setElement(elt) {
  	this.element = elt;
  }
  setStyles() {
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
  }
  componentDidMount() {
  	this.setStyles();
  }
  componentDidUpdate() {
  	this.setStyles();
  }
  onRowClick() {
	  if (this.props.onRowClick && this.props.onRowClick!=null) {
		  this.props.onRowClick(this.props.rowIndex);
	  } 
  }
  render() {
  	  return (
		<tr onClick={(evt) => { return this.onRowClick(evt) }}
			ref={(elt) => this.setElement(elt)} className={this.props.rowClass}>
			{this.createColumns()}
		</tr>
  	  )
  }
}

class GridPaneTableBody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {custom: true}
	}
	getBodyClass() {
		var clazz = "gridpanetable-body";
		if (this.state.custom) {
			clazz += " gridpanetable-body-scroll";
		}
		return clazz;
	}
	setVScroll(elt) {
		this.element = elt;
		this.props.service.setBody(elt);
	}
  createRows(custom) {
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
  	      	  React.createElement(GridPaneTableRow,
  	      	  	  {columns: columns, key: "row" + rr, rowIndex: rr, height: props.rowHeight,
					rowClass: rowClass, custom: this.state.custom,
					onRowClick: props.onRowClick,
  	      	  		defaultWidth: this.state.defaultWidth, width: this.state.width}
  	      	  )
  	   );
  	  }
  	  return rows;
   }
   componentDidMount() {
  		if (this.props.height>0) {
  			this.element.style.height = this.props.height + "px";
  		}
  }
  render() {
		return (
			<tbody ref={(elt) => this.setVScroll(elt)} className={this.getBodyClass()}>
				{this.createRows(this.state.custom)}
			</tbody>
		)
	}
}

class GridPaneTableHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {custom: true};
	}
  setElement(elt) {
  		this.element = elt;
  		this.props.service.setHeader(elt);
  }
	getHeaderClass() {
		var clazz = "gridpanetable-head";
		if (this.state.custom) {
			clazz += " gridpanetable-head-scroll";
		}
		return clazz;
	}
	render() {
		return (
  		<thead className={this.getHeaderClass()} ref={(elt) => this.setElement(elt)}>
				<GridPaneTableRow
					columns={this.props.columns} height={this.props.height}
					 rowClass={this.props.headerClass} isHeader="true"
					 custom={this.state.custom}
					 defaultWidth={this.state.defaultWidth} width={this.state.width}>
				</GridPaneTableRow>
			</thead>
		)
	}
}

class GridPaneTableColumnOption extends React.Component {
	getDisplayName() {
		if (this.props.column.referenceName) {
			return this.props.column.referenceName;
		}
		else {
			return this.props.column.displayName;
		}
	}
	getLabelClass() {
		var clazz = "";
		if (this.props.column.noHide) {
			clazz = "gridpanetable-disabled";
		}
		return clazz;
	}
	componentDidMount() {
		if (this.props.column.display) {
			this.element.checked = true;
		}
  }
  setElement(elt) {
	  this.element = elt;
	}
	handleChange() {
		var chk = this.element.checked;
		this.props.gpTable.updateColumn(this.props.columnIndex, chk);
	}
  render() {
  	return (
  		<div className="gridpanetable-option">
				<input type="checkbox" ref={(elt) => this.setElement(elt)}
  				disabled={this.props.column.noHide}
  				onChange={ (evt) => {return this.handleChange(evt) }}></input>
				{GridPaneTable.WHITE_SPACE}
  			<span className={this.getLabelClass()}>{this.getDisplayName()}</span>
			</div>
  	)
  }
}

class GridPaneTableOptionsLink extends React.Component {
	constructor(props) {
		super(props);
		this.props.gpTable.optionsLink = this;
		this.state = {optionsDisplayed: "none"};
	}
	showOptions(evt, evtArg) {
		var optionsState = this.state.optionsDisplayed;
		if (optionsState == "none") {
			optionsState = "block";
		}
		else {
			optionsState = "none";
		}
		this.setState({optionsDisplayed: optionsState,
			optionsRight: evt.clientX, optionsTop: evt.clientY});
	}
	moveOptions(newRight) {
		var optionsState = this.state.optionsDisplayed;
		if (this.state.optionsDisplayed == "block") {
			this.setState({optionsDisplayed: optionsState,
				optionsRight: newRight, optionsTop: this.state.optionsTop});
		}
	}
	setOptionsDisplay(elt) {
		this.optionsDisplay = elt;
	}
	createColumnOptions() {
		var columnOptions = [];
		for (var cc=0; cc<this.props.columns.length; cc++) {
			var columnOption = React.createElement(GridPaneTableColumnOption,
				{key: "colOpt" + cc
				,column: this.props.columns[cc], columnIndex: cc
				,gpTable: this.props.gpTable}
				,null);
			columnOptions.push(columnOption);
		}
		return columnOptions;
	}
	componentDidUpdate() {
		this.optionsDisplay.style.display = this.state.optionsDisplayed;
		var rect = this.optionsDisplay.getBoundingClientRect();
		var optionsLeft = this.state.optionsRight - rect.width;
		if (optionsLeft<0) {
			optionsLeft = 0;
		}
		if (this.state.optionsDisplayed == "block") {
			this.optionsDisplay.style.left = optionsLeft + "px";
		}
	}
 render() {
  	return (
  		<span>
  			<span className="gridpanetable-options-link"
					onClick={(evt) => { return this.showOptions(evt) }}>
  				{this.props.optionsTitle}
  				<span className="gridpanetable-options-icon">⚙</span>
  			</span>
  			<div className="gridpanetable-options" ref={ (elt) => this.setOptionsDisplay(elt)}>
  				{this.createColumnOptions()}
  			</div>
  		</span>
  	)
  }
}

class GridPaneTableCaption extends React.Component {
	render() {
		return (
  	  <caption className="gridpanetable-caption">
  	  	<div className="gridpanetable-caption-left">{GridPaneTable.WHITE_SPACE}</div>
	  		<div className="gridpanetable-caption-center">{this.props.title}</div>
  			<div className="gridpanetable-caption-right">
  				<GridPaneTableOptionsLink columns={this.props.columns} gpTable={this.props.gpTable}
						optionsTitle={this.props.optionsTitle}>
					</GridPaneTableOptionsLink>
  			</div>
  		</caption>
		)
	}
}

class GridPaneTableTable extends React.Component {
	constructor(props) {
		super(props);
		this.service = new GridPaneTableService();
		this.maxHeight = this.props.rowHeight * this.props.numRows;
  		this.columns = [];
		this.maxWidth = 0;
		this.optionsLink = null;
		for (var cc=0; cc<this.props.columns.length; cc++) {
	  		var column = this.props.columns[cc];
	  		var cloneColumn = {
	  			left: this.maxWidth, display: true
	  		};
	  		for (var p in column) {
	  			cloneColumn[p] = column[p];
	  		}
	  		this.columns.push(cloneColumn);
	  		if (cloneColumn.display) {
	  			this.maxWidth += column.width;
	  		}
	  	}
	  	this.state = {custom: true};
  }
  getColumnPositions() {
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
  }
  setHeader (elt) {
  	this.header = elt;
  }
  createRowProps(custom) {
	  var rowProps = {};
	  var rr = 0;
	  rowProps.numRows = this.props.numRows;
	  rowProps.rowHeight = GridPaneTable.DEFAULT_ROW_HEIGHT;
	  if (this.props.rowHeight) {
			rowProps.rowHeight = this.props.rowHeight;
	  }
	  rowProps.rowClass = "gridpanetable-row-default";
	  rowProps.onRowClick = this.props.onRowClick;
	  var props = this.props;
	  if (props.evenClass && props.evenClass!=null && props.evenClass.length>0) {
	  		rowProps.evenClass = props.evenClass;
	  }
	  if (props.oddClass && props.oddClass!=null && props.oddClass.length>0) {
	  		rowProps.oddClass = props.oddClass;
	  }
	  return rowProps;
  }
  setBody (elt) {
  	this.body = elt;
  }
  createCaption() {
	  if (this.props.caption) {
	  	  var captionProps = {title: GridPaneTable.WHITE_SPACE,
	  	  	gpTable: this, columns: this.columns};
	  	  if (this.props.caption.title) {
	  	  	  captionProps.title = this.props.caption.title;
	  	  }
	  	  if (this.props.caption.optionsTitle) {
	  	  	  captionProps.optionsTitle = this.props.caption.optionsTitle;
	  	  }
	  	  return React.createElement(GridPaneTableCaption, captionProps, null)
	  }
	  else {
	  	  return null;
	  }
  }
  createHeader () {
		var parentTable = this;
		var rowHeight = GridPaneTable.DEFAULT_ROW_HEIGHT;
		var headerClass = "gridpanetable-header-default";
		if (this.props.headerRowHeight) {
			rowHeight = this.props.headerRowHeight;
		}
		if (this.props.headerClass && this.props.headerClass!=null  && this.props.headerClass.length>0) {
			headerClass = this.props.headerClass;
		}
  	return React.createElement(GridPaneTableHeader,
  		{columns: this.columns, service: this.service, height: rowHeight,
				headerClass: headerClass, ref: function(elt) { parentTable.setHeader(elt); }});
  }
  setElement(elt) {
  	  this.element = elt;
  }
  componentWillUpdate() {
  	  if (this.colIndex!=null && this.colIndex > -1) {
  	  	  this.columns[this.colIndex].display = this.newDisplay;
  	  	  this.getColumnPositions();
  	  }
  }
  updateColumn(colIndex, newDisplay) {
  	  this.colIndex = colIndex;
  	  this.newDisplay = newDisplay;
  	  this.setState({colIndex: colIndex, newDisplay: newDisplay});
  }
  resize(me, element, isResizeEvent) {
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
  }
  render() {
  	  return (
  	  	<table ref={(elt) => this.setElement(elt)} className="gridpanetable-table">
  	  		{this.createCaption()}
  	  		{this.createHeader()}
  	      <GridPaneTableBody rowProps={this.createRowProps()} columns={this.columns}
  	       service={this.service} ref={(elt) => this.setBody(elt)}>
				 </GridPaneTableBody>
			 </table>
   	)
  }
  componentDidMount() {
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
  }
  conponentWillUnmount () {
  	window.removeEventListener("resize", this.resizeMe);
	}
}
