class RightDiv extends React.Component {
  render() {
    return (
      <div className="testtable-right">{this.props.value}</div>
    )
  }
}

class AgeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {indicator: ""};
  }
  sort() {
    if (!this.sortDir || this.sortDir==null || this.sortDir == "DOWN") {
      this.sortDir = "UP";
      this.setState({indicator: "+"});
    }
    else {
      this.sortDir = "DOWN"
      this.setState({indicator: "-"});
    }
    sortableTable.updateSort(this.sortDir);
  }
  render() {
    return (
      <span onClick={ (evt) => { return this.sort(evt); }}>
        Age{this.state.indicator}
      </span>
    )
  }
}

class SortableTable extends React.Component {
  constructor(props) {
    super(props)
    sortableTable = this;
    this.state = {sort: "none", columns: columns};
  }
  updateSort(dir) {
    sortData(dir);
    this.setState({sort: dir});
  }
  getCaption() {
    return {optionsTitle: "Change Columns"};
  }
  getVerticalResizer() {
    return {remainingHeight: 40, minHeight: 250};
  }
  render() {
    return (
      <GridPaneTableTable
        columns={columns}
        caption={this.getCaption()}
        minWidth="350"
        sortDir={this.state.sort}
        numRows={tableData.length}
        verticalResizer={this.getVerticalResizer()}
        headerRowHeight="40"
        headerClass="testtable-header"
        evenClass="testtable-even"
        oddClass="testtable-odd"></GridPaneTableTable>
    )
  }
}
