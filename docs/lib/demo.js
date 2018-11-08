"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightDiv = function (_React$Component) {
  _inherits(RightDiv, _React$Component);

  function RightDiv() {
    _classCallCheck(this, RightDiv);

    return _possibleConstructorReturn(this, (RightDiv.__proto__ || Object.getPrototypeOf(RightDiv)).apply(this, arguments));
  }

  _createClass(RightDiv, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "testtable-right" },
        this.props.value
      );
    }
  }]);

  return RightDiv;
}(React.Component);

var AgeHeader = function (_React$Component2) {
  _inherits(AgeHeader, _React$Component2);

  function AgeHeader(props) {
    _classCallCheck(this, AgeHeader);

    var _this2 = _possibleConstructorReturn(this, (AgeHeader.__proto__ || Object.getPrototypeOf(AgeHeader)).call(this, props));

    _this2.state = { indicator: "" };
    return _this2;
  }

  _createClass(AgeHeader, [{
    key: "sort",
    value: function sort() {
      if (!this.sortDir || this.sortDir == null || this.sortDir == "DOWN") {
        this.sortDir = "UP";
        this.setState({ indicator: "+" });
      } else {
        this.sortDir = "DOWN";
        this.setState({ indicator: "-" });
      }
      sortableTable.updateSort(this.sortDir);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement(
        "span",
        { onClick: function onClick(evt) {
            return _this3.sort(evt);
          } },
        "Age",
        this.state.indicator
      );
    }
  }]);

  return AgeHeader;
}(React.Component);

var SortableTable = function (_React$Component3) {
  _inherits(SortableTable, _React$Component3);

  function SortableTable(props) {
    _classCallCheck(this, SortableTable);

    var _this4 = _possibleConstructorReturn(this, (SortableTable.__proto__ || Object.getPrototypeOf(SortableTable)).call(this, props));

    sortableTable = _this4;
    _this4.state = { sort: "none", columns: columns };
    return _this4;
  }

  _createClass(SortableTable, [{
    key: "updateSort",
    value: function updateSort(dir) {
      sortData(dir);
      this.setState({ sort: dir });
    }
  }, {
    key: "getCaption",
    value: function getCaption() {
      return { optionsTitle: "Change Columns" };
    }
  }, {
    key: "getVerticalResizer",
    value: function getVerticalResizer() {
      return { remainingHeight: 40, minHeight: 250 };
    }
  }, {
    key: "showRow",
    value: function showRow(i) {
      alert("Row " + i + " clicked!");
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(GridPaneTableTable, {
        columns: columns,
        caption: this.getCaption(),
        minWidth: "350",
        sortDir: this.state.sort,
        numRows: tableData.length,
        verticalResizer: this.getVerticalResizer(),
        headerRowHeight: "40",
        headerClass: "testtable-header",
        evenClass: "testtable-even",
        oddClass: "testtable-odd"
      });
    }
  }]);

  return SortableTable;
}(React.Component);

