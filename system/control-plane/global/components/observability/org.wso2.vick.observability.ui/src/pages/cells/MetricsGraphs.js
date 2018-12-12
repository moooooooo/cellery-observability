/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Blue from "@material-ui/core/colors/blue";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Constants from "../common/constants";
import Grid from "@material-ui/core/Grid";
import Orange from "@material-ui/core/colors/orange";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import {withStyles} from "@material-ui/core/styles";
import {
    Crosshair,
    DiscreteColorLegend,
    Hint,
    HorizontalBarSeries,
    HorizontalGridLines,
    LineSeries,
    RadialChart,
    VerticalGridLines,
    XAxis,
    XYPlot,
    YAxis,
    makeWidthFlexible
} from "react-vis";
import withColor, {ColorGenerator} from "../common/color";

const styles = {
    root: {
        flexGrow: 1
    },
    card: {
        boxShadow: "none",
        border: "1px solid #eee"
    },
    pos: {
        marginBottom: 12
    },
    cardHeader: {
        borderBottom: "1px solid #eee"
    }, title: {
        fontSize: 16,
        fontWeight: 500,
        color: "#4d4d4d"
    },
    cardDetails: {
        fontSize: 28,
        display: "inline-block"
    },
    cardDetailsSecondary: {
        fontSize: 16,
        display: "inline-block",
        paddingLeft: 5
    },
    contentGrid: {
        height: 186
    },
    toolTipHead: {
        fontWeight: 600
    }
};

const MSEC_DAILY = 86400000;
const timestamp = new Date("December 9 2018").getTime();
const dateTimeFormat = Constants.Pattern.DATE_TIME;
const FlexibleWidthXYPlot = makeWidthFlexible(XYPlot);
const sizeData = [
    [
        {x: timestamp + MSEC_DAILY, y: 3},
        {x: timestamp + MSEC_DAILY * 2, y: 5},
        {x: timestamp + MSEC_DAILY * 3, y: 15},
        {x: timestamp + MSEC_DAILY * 4, y: 10},
        {x: timestamp + MSEC_DAILY * 5, y: 6},
        {x: timestamp + MSEC_DAILY * 6, y: 3},
        {x: timestamp + MSEC_DAILY * 7, y: 9},
        {x: timestamp + MSEC_DAILY * 8, y: 11}
    ],
    [
        {x: timestamp + MSEC_DAILY, y: 10},
        {x: timestamp + MSEC_DAILY * 2, y: 4},
        {x: timestamp + MSEC_DAILY * 3, y: 2},
        {x: timestamp + MSEC_DAILY * 4, y: 15},
        {x: timestamp + MSEC_DAILY * 5, y: 13},
        {x: timestamp + MSEC_DAILY * 6, y: 6},
        {x: timestamp + MSEC_DAILY * 7, y: 7},
        {x: timestamp + MSEC_DAILY * 8, y: 2}
    ]
];

class MetricsGraphs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            donutTooltip: false,
            barTooltip: false,
            sizeTooltip: [],
            volumeTooltip: false,
            durationTooltip: false
        };
    }

    onMouseLeave = () => {
        this.setState({sizeTooltip: []});
    };

    onNearestX = (value, {index}) => {
        this.setState({sizeTooltip: sizeData.map((d) => d[index])});
    };

    render = () => {
        const {classes, colorGenerator} = this.props;
        const {donutTooltip, barTooltip, volumeTooltip, durationTooltip, sizeTooltip} = this.state;
        const successColor = colorGenerator.getColor(ColorGenerator.SUCCESS);
        const errColor = colorGenerator.getColor(ColorGenerator.ERROR);
        const BarSeries = HorizontalBarSeries;
        const pieChartData = [
            {title: "Error", theta: 2, percentage: "20%", color: errColor},
            {title: "Success", theta: 8, percentage: "80%", color: successColor}
        ];
        const volumeChart = {
            data: [
                {x: timestamp + MSEC_DAILY, y: 3},
                {x: timestamp + MSEC_DAILY * 2, y: 5},
                {x: timestamp + MSEC_DAILY * 3, y: 15},
                {x: timestamp + MSEC_DAILY * 4, y: 10},
                {x: timestamp + MSEC_DAILY * 5, y: 6},
                {x: timestamp + MSEC_DAILY * 6, y: 3},
                {x: timestamp + MSEC_DAILY * 7, y: 9},
                {x: timestamp + MSEC_DAILY * 8, y: 11}
            ],
            onNearestX: (d) => this.setState({volumeTooltip: d})
        };
        const durationChart = {
            data: [
                {x: timestamp + MSEC_DAILY, y: 3},
                {x: timestamp + MSEC_DAILY * 2, y: 5},
                {x: timestamp + MSEC_DAILY * 3, y: 15},
                {x: timestamp + MSEC_DAILY * 4, y: 10},
                {x: timestamp + MSEC_DAILY * 5, y: 6},
                {x: timestamp + MSEC_DAILY * 6, y: 3},
                {x: timestamp + MSEC_DAILY * 7, y: 9},
                {x: timestamp + MSEC_DAILY * 8, y: 11}
            ],
            onNearestX: (d) => this.setState({durationTooltip: d})
        };

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item md={3} sm={6} xs={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                classes={{
                                    title: classes.title
                                }}
                                title="Success/ Failure Rate"
                                className={classes.cardHeader}
                            />
                            <CardContent className={classes.content} align="center">
                                <RadialChart
                                    className={"donut-chart"}
                                    innerRadius={60}
                                    radius={85}
                                    getAngle={(d) => d.theta}
                                    data={pieChartData}
                                    onValueMouseOver={(v) => this.setState({donutTooltip: v})}
                                    onSeriesMouseOut={(v) => this.setState({donutTooltip: false})}
                                    width={180}
                                    height={180}

                                    colorType="literal"
                                >
                                    {donutTooltip && <Hint value={donutTooltip}>
                                        <div className="rv-hint__content">
                                            {`${donutTooltip.title} : ${donutTooltip.percentage}`}</div>
                                    </Hint>}
                                </RadialChart>
                                <div>
                                    <DiscreteColorLegend items={pieChartData.map((d) => d.title)}
                                        colors={[errColor, successColor]}
                                        orientation="horizontal"/>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={3} sm={6} xs={12} alignItems="center">
                        <Grid item sm={12} className={classes.contentGrid}>
                            <Card className={classes.card}>
                                <CardHeader
                                    classes={{
                                        title: classes.title
                                    }}
                                    title="Average Response Time"
                                    className={classes.cardHeader}
                                />
                                <CardContent align="center">
                                    <Typography className={classes.cardDetails}>
                                        200
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.cardDetailsSecondary}>
                                        ms
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={12} className={classes.contentGrid}>
                            <Card className={classes.card}>
                                <CardHeader
                                    classes={{
                                        title: classes.title
                                    }}
                                    title="Average Request Count"
                                    className={classes.cardHeader}
                                />
                                <CardContent align="center">
                                    <Typography className={classes.cardDetails}>
                                        25
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.cardDetailsSecondary}>
                                        Requests/s
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                classes={{
                                    title: classes.title
                                }}
                                title="HTTP Traffic"
                                className={classes.cardHeader}
                            />
                            <CardContent className={classes.content}>
                                <div>
                                    <FlexibleWidthXYPlot
                                        yType="ordinal"
                                        stackBy="x"
                                        height={180}>
                                        <VerticalGridLines/>
                                        <HorizontalGridLines/>
                                        <XAxis/>
                                        <YAxis/>
                                        <BarSeries
                                            color={successColor}
                                            data={[
                                                {y: "", x: 0, title: "OK"},
                                                {y: "Out", x: 70, title: "OK", percentage: "70%"},
                                                {y: "In", x: 100, title: "OK", percentage: "100%"},
                                                {y: " ", x: 0, title: "OK"}
                                            ]}
                                            onValueMouseOver={(v) => this.setState({barTooltip: v})}
                                            onSeriesMouseOut={(v) => this.setState({barTooltip: false})}
                                        />
                                        <BarSeries
                                            color={Blue[500]}
                                            data={[
                                                {y: "", x: 0, title: "3xx"},
                                                {y: "Out", x: 20, title: "3xx", percentage: "20%"},
                                                {y: "In", x: 0, title: "3xx", percentage: "0%"},
                                                {y: " ", x: 0, title: "3xx"}
                                            ]}
                                            onValueMouseOver={(v) => this.setState({barTooltip: v})}
                                            onSeriesMouseOut={(v) => this.setState({barTooltip: false})}
                                        />
                                        <BarSeries
                                            color={Orange[500]}
                                            data={[
                                                {y: "", x: 0, title: "4xx"},
                                                {y: "Out", x: 5, title: "4xx", percentage: "5%"},
                                                {y: "In", x: 0, title: "4xx", percentage: "0%"},
                                                {y: " ", x: 0, title: "4xx"}
                                            ]}
                                            onValueMouseOver={(v) => this.setState({barTooltip: v})}
                                            onSeriesMouseOut={(v) => this.setState({barTooltip: false})}
                                        />
                                        <BarSeries
                                            color={errColor}
                                            data={[
                                                {y: "", x: 0, title: "5xx"},
                                                {y: "Out", x: 5, title: "5xx", percentage: "5%"},
                                                {y: "In", x: 0, title: "5xx", percentage: "0%"},
                                                {y: " ", x: 0, title: "5xx"}
                                            ]}
                                            onValueMouseOver={(v) => this.setState({barTooltip: v})}
                                            onSeriesMouseOut={(v) => this.setState({barTooltip: false})}
                                        />
                                        {barTooltip && <Hint value={barTooltip}>
                                            <div className="rv-hint__content">
                                                {`${barTooltip.title} : ${barTooltip.percentage}`}</div>
                                        </Hint>}
                                    </FlexibleWidthXYPlot>
                                    <DiscreteColorLegend
                                        orientation="horizontal"
                                        items={[
                                            {
                                                title: "OK",
                                                color: successColor
                                            },
                                            {
                                                title: "4xx",
                                                color: Blue[500]
                                            },
                                            {
                                                title: "3xx",
                                                color: Orange[500]
                                            },
                                            {
                                                title: "2xx",
                                                color: errColor
                                            }
                                        ]}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                classes={{
                                    title: classes.title
                                }}
                                title="Request Volume"
                                className={classes.cardHeader}
                            />
                            <CardContent className={classes.content}>
                                <div className={classes.lineChart}>
                                    <FlexibleWidthXYPlot xType="time" height={400}
                                        onMouseLeave={() => this.setState({volumeTooltip: false})}>
                                        <HorizontalGridLines/>
                                        <VerticalGridLines/>
                                        <XAxis title="Time"/>
                                        <YAxis title="Volume(ops)"/>
                                        <LineSeries
                                            {...volumeChart}
                                        />
                                        {volumeTooltip && <Crosshair values={[volumeTooltip]}>
                                            <div className="rv-hint__content">
                                                {`${moment(volumeTooltip.x).format(Constants.Pattern.DATE_TIME)} :
                                                ${volumeTooltip.y}`}</div>
                                        </Crosshair>}
                                    </FlexibleWidthXYPlot>
                                    <DiscreteColorLegend
                                        orientation="horizontal"
                                        items={[
                                            {
                                                title: "Request",
                                                color: "#12939a"
                                            }
                                        ]}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                classes={{
                                    title: classes.title
                                }}
                                title="Request Duration"
                                className={classes.cardHeader}
                            />
                            <CardContent className={classes.content}>
                                <div className={classes.lineChart}>
                                    <FlexibleWidthXYPlot xType="time" height={400}
                                        onMouseLeave={() => this.setState({durationTooltip: false})}>
                                        <HorizontalGridLines/>
                                        <VerticalGridLines/>
                                        <XAxis title="Time"/>
                                        <YAxis title="Duration(s)"/>
                                        <LineSeries color="#3f51b5"
                                            {...durationChart}

                                        />
                                        {durationTooltip && <Crosshair values={[durationTooltip]}>
                                            <div className="rv-hint__content">
                                                {`${moment(durationTooltip.x).format(Constants.Pattern.DATE_TIME)} :
                                                ${durationTooltip.y}`}</div>
                                        </Crosshair>}
                                    </FlexibleWidthXYPlot>
                                    <DiscreteColorLegend
                                        orientation="horizontal"
                                        items={[
                                            {
                                                title: "Request",
                                                color: "#3f51b5"
                                            }
                                        ]}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                classes={{
                                    title: classes.title
                                }}
                                title="Request/Response Size"
                                className={classes.cardHeader}
                            />
                            <CardContent className={classes.content}>
                                <div>
                                    <FlexibleWidthXYPlot xType="time" height={400} onMouseLeave={this.onMouseLeave}>
                                        <HorizontalGridLines/>
                                        <VerticalGridLines/>
                                        <XAxis title="Time"/>
                                        <YAxis title="Size"/>
                                        <LineSeries color="#5bbd5a"
                                            data={sizeData[0]}
                                            onNearestX={this.onNearestX}
                                        />
                                        <LineSeries
                                            data={sizeData[1]}
                                        />
                                        <Crosshair
                                            values={this.state.sizeTooltip}
                                        >
                                            {
                                                sizeTooltip.length > 0
                                                    ? (
                                                        <div className="rv-hint__content">
                                                            <div className={classes.toolTipHead}>
                                                                {`${moment(sizeTooltip[0].x).format(dateTimeFormat)}`}
                                                            </div>
                                                            <div>{`Request: ${sizeTooltip[0].y}`}</div>
                                                            <div>{`Response: ${sizeTooltip[1].y}`}</div>
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </Crosshair>
                                    </FlexibleWidthXYPlot>
                                    <DiscreteColorLegend
                                        orientation="horizontal"
                                        items={[
                                            {
                                                title: "Request",
                                                color: "#5bbd5a"
                                            },
                                            {
                                                title: "Response",
                                                color: "#76c7e3"
                                            }
                                        ]}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

MetricsGraphs.propTypes = {
    classes: PropTypes.object.isRequired,
    colorGenerator: PropTypes.instanceOf(ColorGenerator).isRequired
};

export default withStyles(styles)(withColor(MetricsGraphs));
