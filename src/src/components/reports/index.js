import React, { Component } from 'react';
import Const from '../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import EmployeesDropDown from '../common/employeeDropDown'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { NotificationManager } from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import Footer from '../common/footer'
import * as d3 from 'd3'
import $ from 'jquery';
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const columns = [
    { title: "Date", width: { wch: 25 } },
    { title: "Hours Worked", width: { wch: 15 } },
    { title: "Idle Time", width: { wch: 15 } },
    { title: "Actual Work", width: { wch: 15 } },
    { title: "Manual Time", width: { wch: 15 } },
]
const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    filterDiv: {
        textAlign: 'center',
        padding: '18px !important'
    }, leftIcon: {
        marginRight: theme.spacing.unit,
    },
    paper: {
        marginBottom: 30,
    },
    reportTitle: {
        marginBottom: 15,
        marginTop: 15
    },
    button: {
        backgroundColor: '#1BB56D !important'
    },
    progress: {
        marginLeft: 55,
        marginTop: 3
    }
});
class Employees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
            SelectedEmployeeId: '',
            ReportsData: [],
            ReportsDataExport: [],
            AllReportData: [],
            showTable: false,
            allDataLoaded: false,
            loader: false,
            disabledForOne: true,
            ExcelReport: [{
                columns: columns,
                data: []
            }]
        };
    }

    generateExcelData() {
        var tempData = []
        var item = {}
        try {
            this.state.ReportsDataExport.map((data, i) => (
                tempData = [],
                item = {},
                item['columns'] = [this.getReportDate(data.values[0].WeekStartDate) + ' To ' + this.getReportDate(data.values[0].WeekEnd)],
                item['data'] = [],
                i === 0 ? item['ySteps'] = 0 : item['ySteps'] = 1,
                data.values.map((row) => (
                    tempData.push(row.ScreenDate),
                    tempData.push(this.getHours(row.TotalWorkTime)),
                    tempData.push(this.getHours(row.IdleTime)),
                    tempData.push(this.getHours(row.ActualWork)),
                    tempData.push('0'),
                    item['data'].push(tempData),
                    tempData = []
                )),
                tempData.push({ value: "Total", style: { font: { bold: true } } }),
                tempData.push({ value: this.getTotalWorkTimeExport(data.key, 'TotalWorkTime'), style: { font: { bold: true } } }),
                tempData.push({ value: this.getTotalWorkTimeExport(data.key, 'IdleTime'), style: { font: { bold: true } } }),
                tempData.push({ value: this.getTotalWorkTimeExport(data.key, 'ActualWork'), style: { font: { bold: true } } }),
                tempData.push({ value: '0', style: { font: { bold: true } } }),
                item['data'].push(tempData),
                tempData = [],
                this.state.ExcelReport.push(item),
                item = {}
            ))
            tempData.push('Grand Total');
            tempData.push(this.getGrandTotalWorkTimeExport('TotalWorkTime'));
            tempData.push(this.getGrandTotalWorkTimeExport('IdleTime'));
            tempData.push(this.getGrandTotalWorkTimeExport('ActualWork'));
            tempData.push('0');
            item['ySteps'] = 2;
            item['columns'] = tempData;
            item['data'] = [];
            this.state.ExcelReport.push(item);
            this.setState({
                ExcelReport: this.state.ExcelReport,
                reportStartDate: this.getDateFromPicker(this.state.startDate),
                reportEndDate: this.getDateFromPicker(this.state.endDate)
            }, () => {
                $('#exportButton').trigger("click");
            }
            )
            this.props.loader(false);
        } catch (e) {
            this.props.loader(false);
        }
    }
    DownloadAllRecord = () => {
        var tempData = []
        var item = {}
        this.state.AllReportData.map((data1, i) => (
            this.setState({
                ['multiDataSet_' + i]: [{
                    columns: columns,
                    data: []
                }]
            }),
            data1.values.map((data, j) => (
                tempData = [],
                item = {},
                item['columns'] = [this.getReportDate(data.values[0].WeekStartDate) + ' To ' + this.getReportDate(data.values[0].WeekEnd)],
                item['data'] = [],
                j === 0 ? item['ySteps'] = 0 : item['ySteps'] = 1,
                data.values.map((row) => (
                    tempData.push(row.ScreenDate),
                    tempData.push(this.getHours(row.TotalWorkTime)),
                    tempData.push(this.getHours(row.IdleTime)),
                    tempData.push(this.getHours(row.ActualWork)),
                    tempData.push('0'),
                    item['data'].push(tempData),
                    tempData = []
                )),
                tempData.push({ value: "Total", style: { font: { bold: true } } }),
                tempData.push({ value: this.getAllTotalWorkTime(data.key, i, 'TotalWorkTime'), style: { font: { bold: true } } }),
                tempData.push({ value: this.getAllTotalWorkTime(data.key, i, 'IdleTime'), style: { font: { bold: true } } }),
                tempData.push({ value: this.getAllTotalWorkTime(data.key, i, 'ActualWork'), style: { font: { bold: true } } }),
                tempData.push({ value: '0', style: { font: { bold: true } } }),
                item['data'].push(tempData),
                this.state['multiDataSet_' + i].push(item),
                tempData = [],
                item = {}
            )),
            tempData.push('Grand Total'),
            tempData.push(this.getGrandTotalWorkTimeForAll('TotalWorkTime', i)),
            tempData.push(this.getGrandTotalWorkTimeForAll('IdleTime', i)),
            tempData.push(this.getGrandTotalWorkTimeForAll('ActualWork', i)),
            tempData.push('0'),
            item['ySteps'] = 2,
            item['columns'] = tempData,
            item['data'] = [],
            this.state['multiDataSet_' + i].push(item),

            this.setState({
                ['multiDataSet_' + i]: this.state['multiDataSet_' + i],

            })
        ))
        this.setState({
            allDataLoaded: true,
            reportStartDate: this.getDateFromPicker(this.state.startDate),
            reportEndDate: this.getDateFromPicker(this.state.endDate),
            loader: false
        }, () => {
            $('#exportAllButton').trigger("click");
        })
    }
    componentWillMount() {
        this.props.headerTitle('Reports', 4);
    }
    selectEmployee(SelectedEmployeeId, label) {
        this.setState({
            SelectedEmployeeId: SelectedEmployeeId,
            selectedEmployeeName: label
        })
    }
    getDateFromPicker(date) {
        var date = new Date(date)
        var month = (date.getMonth() + 1);
        var day = (date.getDate());
        var year = (date.getFullYear());
        return year + '-' + month + '-' + day;
    }
    getAllEmployeeReport() {

        if (!this.state.startDate) {
            NotificationManager.error('Error', 'Select start date first!.');
            return false;
        }
        if (!this.state.endDate) {
            NotificationManager.error('Error', 'Select end date first!.');
            return false;
        }
        this.setState({
            loader: true
        })
        var body = {
            OrganizationID: this.state.OrganizationID,
            EmployeeId: '',
            StartDate: this.getDateFromPicker(this.state.startDate) + ' 00:00:00',
            EndDate: this.getDateFromPicker(this.state.endDate) + ' 23:59:59'
        }

        fetch(Const.API_ROOT + Const.GET_EMPLOYEE_REPORT, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                responseJson = responseJson[0];
                if (responseJson.length) {
                    var expensesByName = d3.nest()
                        .key(function (d) { return d.EmpCode; })
                        .entries(responseJson);
                    responseJson = expensesByName;
                    responseJson.map((data) => (
                        expensesByName = d3.nest()
                            .key(function (d) { return d.ID; })
                            .entries(data.values),
                        data.values = expensesByName
                    ))
                    this.setState({
                        AllReportData: responseJson,
                    })
                    this.DownloadAllRecord();
                } else {
                    this.setState({
                        loader: false
                    })
                    NotificationManager.error('Error', 'No record found!');
                }
            })
            .catch((error) => {
                this.setState({
                    loader: false
                })
                console.error(error);
            })
    }
    getEmployeeReport() {

        if (!this.state.startDate) {
            NotificationManager.error('Error', 'Select start date first!.');
            return false;
        }
        if (!this.state.endDate) {
            NotificationManager.error('Error', 'Select end date first!.');
            return false;
        }
        if (!this.state.SelectedEmployeeId) {
            NotificationManager.error('Error', 'Select employee  first!.');
            return false;
        }
        var body = {
            OrganizationID: this.state.OrganizationID,
            EmployeeId: this.state.SelectedEmployeeId,
            StartDate: this.getDateFromPicker(this.state.startDate) + ' 00:00:00',
            EndDate: this.getDateFromPicker(this.state.endDate) + ' 23:59:59'
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_EMPLOYEE_REPORT, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                responseJson = responseJson[0];
                var expensesByName = d3.nest()
                    .key(function (d) { return d.ID; })
                    .entries(responseJson);
                this.setState({
                    ReportsData: expensesByName,
                    showTable: true,
                    disabledForOne: false
                })
            })
            .catch((error) => {
                this.props.loader(false);
                console.error(error);
            })
    }
    exportEmployeeReport() {
        this.setState({
            ExcelReport: [{
                columns: columns,
                data: []
            }]
        })
        var body = {
            OrganizationID: this.state.OrganizationID,
            EmployeeId: this.state.SelectedEmployeeId,
            StartDate: this.getDateFromPicker(this.state.startDate) + ' 00:00:00',
            EndDate: this.getDateFromPicker(this.state.endDate) + ' 23:59:59'
        }
        if (!this.state.startDate) {
            NotificationManager.error('Error', 'Select start date first!.');
            return false;
        }
        if (!this.state.endDate) {
            NotificationManager.error('Error', 'Select end date first!.');
            return false;
        }
        if (!this.state.SelectedEmployeeId) {
            NotificationManager.error('Error', 'Select employee  first!.');
            return false;
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_EMPLOYEE_REPORT, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                responseJson = responseJson[0];
                if (responseJson.length) {
                    var expensesByName = d3.nest()
                        .key(function (d) { return d.ID; })
                        .entries(responseJson);
                    this.setState({
                        ReportsDataExport: expensesByName,
                    })
                    this.generateExcelData();
                } else {
                    this.props.loader(false);
                    NotificationManager.error('Error', 'No record found!');
                }
            })
            .catch((error) => {
                this.props.loader(false);
                console.error(error);
            })
    }
    getHours = (minutes) => {
        var hours = Math.floor(minutes / 60);
        var minutes = (minutes % 60)
        if (hours < 0) {
            hours = 0;
        }
        if (minutes < 0) {
            minutes = 0;
        }
        return hours + " : " + minutes;
    }
    getReportDate(date) {
        var date = new Date(date);
        var month = (date.getMonth() + 1);
        var day = (date.getDate());
        var year = (date.getFullYear());
        return month + '/' + day + '/' + year;
    }
    getAllTotalWorkTime = (key, index, Time) => {
        var innerIndex = this.getInnerIndexForAll(key, index)
        var values = this.state.AllReportData[index].values[innerIndex].values;
        var Total = '';
        values.map((data) => (
            Total = parseInt(Total + data[Time])
        ))
        return this.getHours(Total);
    }
    getTotalWorkTime = (key, Time) => {
        var index = this.getIndex(key)
        var values = this.state.ReportsData[index].values;
        var Total = '';
        values.map((data) => (
            Total = parseInt(Total + data[Time])
        ))
        return this.getHours(Total);
    }
    getIndex(key) {
        var index = -1;
        var filteredObj = this.state.ReportsData.find(function (item, i) {
            if (item.key === key) {
                index = i;
            }
        });
        return index;
    }
    getGrandTotalWorkTime = (Time) => {
        var Total = '';
        this.state.ReportsData.map((data) => (
            data.values.map((value) => (
                Total = parseInt(Total + value[Time])
            ))
        ))
        return this.getHours(Total);
    }
    getTotalWorkTimeExport = (key, Time) => {
        var index = this.getIndexExport(key)
        var values = this.state.ReportsDataExport[index].values;
        var Total = '';
        values.map((data) => (
            Total = parseInt(Total + data[Time])
        ))
        return this.getHours(Total);
    }
    getIndexExport(key) {
        var index = -1;
        var filteredObj = this.state.ReportsDataExport.find(function (item, i) {
            if (item.key === key) {
                index = i;
            }
        });
        return index;
    }
    getGrandTotalWorkTimeExport = (Time) => {
        var Total = '';
        this.state.ReportsDataExport.map((data) => (
            data.values.map((value) => (
                Total = parseInt(Total + value[Time])
            ))
        ))
        return this.getHours(Total);
    }
    getGrandTotalWorkTimeForAll = (Time, index) => {
        var Total = '';
        this.state.AllReportData[index].values.map((data) => (
            data.values.map((value) => (
                Total = parseInt(Total + value[Time])
            ))
        ))
        return this.getHours(Total);
    }

    getInnerIndexForAll(key, index1) {
        var index = -1;
        var filteredObj = this.state.AllReportData[index1].values.find(function (item, i) {
            if (item.key === key) {
                index = i;
            }
        });
        return index;
    }
    render() {
        const { classes } = this.props;
        return (
            <div style={{ marginTop: 12 }}>
                <Paper className={classes.paper}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={4} className={classes.filterDiv}>
                            <DateRangePicker
                                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                                isOutsideRange={() => false}
                            />
                        </Grid>
                        <Grid container item xs={12} sm={6} style={{ padding: '12px 0px' }}>
                            <Grid item xs={12} sm={6} >
                                <EmployeesDropDown selectEmployee={this.selectEmployee.bind(this)} />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ paddingLeft: 40, paddingTop: 7 }} >
                                <Button className={classes.button} variant="contained" color="primary" onClick={() => this.getEmployeeReport()}>
                                    <i className={`${classes.leftIcon} material-icons`}>bar_chart</i>View
    </Button>
                                <Button variant="contained" color="primary" style={{marginLeft:5}} className={classes.button} onClick={() => this.exportEmployeeReport()}>
                                    <i className={`${classes.leftIcon} material-icons`}>list_alt</i>Export
                     </Button>
                                <ExcelFile filename={this.state.reportStartDate + ' To ' + this.state.reportEndDate + ' Tracker Report'} element={<Button variant="contained" style={{ display: 'none' }} id="exportButton" >
                                    Export
    </Button>}>
                                    <ExcelSheet dataSet={this.state.ExcelReport} name={this.state.selectedEmployeeName} />
                                </ExcelFile>
                            </Grid>

                        </Grid>
                        <Grid style={{ padding: 0, paddingTop: 18, marginLeft: -5 }} item xs={12} sm={2} >
                            <ExcelFile filename={this.state.reportStartDate + ' To ' + this.state.reportEndDate + ' Tracker Report'} element={<Button style={{ display: 'none' }} id="exportAllButton">
                                Export
                               </Button>}>
                                {this.state.AllReportData.map((n, i) => {
                                    return (
                                        <ExcelSheet dataSet={this.state['multiDataSet_' + i]} name={n.values[0].values[0].Name} key={i} />
                                    );
                                })}
                            </ExcelFile>
                            {this.state.loader ? <CircularProgress className={classes.progress} /> :
                                <Button variant="contained" color="primary" style={{ marginLeft: 10 }} className={classes.button} onClick={() => this.getAllEmployeeReport()}>
                                    <i className={`${classes.leftIcon} material-icons`}>format_list_numbered</i>Export All
                                                        </Button>
                            }
                        </Grid>
                    </Grid>

                </Paper>
                {this.state.showTable && this.state.ReportsData.length ?
                    <div>
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '20%' }} align="center">Date</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Hours Worked</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Idle Time</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Actual Work</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">Manual Time</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </Paper>
                        {this.state.ReportsData.map((report, j) => (
                            <div key={j}>
                                <Typography className={classes.reportTitle} variant="title" align="center"  >
                                    {this.getReportDate(report.values[0].WeekStartDate)} To {this.getReportDate(report.values[0].WeekEnd)}
                                </Typography>
                                <Paper className={classes.root} >

                                    <Table className={classes.table}>
                                        <TableBody>
                                            {report.values.map(row => {
                                                return (
                                                    <TableRow key={row.ScreenDate}>
                                                        <TableCell style={{ width: '20%' }} align="center">{row.ScreenDate}</TableCell>
                                                        <TableCell style={{ width: '20%' }} align="center">{this.getHours(row.TotalWorkTime)}</TableCell>
                                                        <TableCell style={{ width: '20%' }} align="center">{this.getHours(row.IdleTime)}</TableCell>
                                                        <TableCell style={{ width: '20%' }} align="center">{this.getHours(row.ActualWork)}</TableCell>
                                                        <TableCell style={{ width: '20%' }} align="center">0</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            <TableRow>
                                                <TableCell style={{ width: '20%', fontWeight: 'bold' }} align="center">Total</TableCell>
                                                <TableCell style={{ width: '20%', fontWeight: 'bold' }} align="center">{this.getTotalWorkTime(report.key, 'TotalWorkTime')}</TableCell>
                                                <TableCell style={{ width: '20%', fontWeight: 'bold' }} align="center">{this.getTotalWorkTime(report.key, 'IdleTime')}</TableCell>
                                                <TableCell style={{ width: '20%', fontWeight: 'bold' }} align="center">{this.getTotalWorkTime(report.key, 'ActualWork')}</TableCell>
                                                <TableCell style={{ width: '20%', fontWeight: 'bold' }} align="center">0</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </div>
                        ))}
                        <Paper className={classes.root} style={{ marginTop: 30 }}>
                            <Table className={classes.table}>
                                <tbody>
                                    <TableRow>
                                        <TableCell style={{ width: '20%' }} align="center">Grand Total</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">{this.getGrandTotalWorkTime('TotalWorkTime')}</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">{this.getGrandTotalWorkTime('IdleTime')}</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">{this.getGrandTotalWorkTime('ActualWork')}</TableCell>
                                        <TableCell style={{ width: '20%' }} align="center">0</TableCell>
                                    </TableRow>
                                </tbody>
                            </Table>
                        </Paper></div> : this.state.showTable ? <Typography style={{ marginTop: 250 }} variant="h5" align="center"  >
                            No record found!
                     </Typography> : ''
                }


                <Footer />

            </div>
        );
    }
}



export default withStyles(styles)(Employees);