/**
 * Created by yuanguozheng on 16/1/22.
 */
'use strict';
import React, {
    Component,
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    ListView,
    RefreshControl,
    Dimensions,
    PixelRatio,
    TouchableWithoutFeedback
} from 'react-native';
import StaticContainer from 'react-static-container';
import ViewPager from 'react-native-viewpager';
import MenuButton from '../MenuButton';

const len = 160;

export default class HomePage extends Component {

    constructor(props) {
        super(props);

        // 用于构建DataSource对象
        var dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });
        this._onMenuClick = this._onMenuClick.bind(this);
        this._onRecommendClick = this._onRecommendClick.bind(this);
        this._renderRow = this._renderRow.bind(this);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        // 实际的DataSources存放在state中
        this.state = {
            dataSource: dataSource.cloneWithPages(BANNER_IMGS),
            listData: ds
        }
    }

    componentWillMount() {
        fetch('http://m.jd.com/index/recommend.action?_format_=json&page=1')
            .then((res) => res.json())
            .then((str) => {
                let arr = JSON.parse(str.recommend).wareInfoList;
                var rows = [];
                for (let i = 0; i < arr.length; i += 2) {
                    var item = { id: i, left: null, right: null };
                    item.left = (arr[i]);
                    if (i < arr.length - 1) {
                        item.right = (arr[i + 1]);
                    }
                    rows.push(item);
                }
                var ds = this.state.listData.cloneWithRows(rows);
                this.setState({ listData: ds });
            });
    }

    _renderPage(data, pageID) {
        return (
            <Image
                source={data}
                style={styles.page}/>
        );
    }

    _onMenuClick(title, tag) {
        Alert.alert('提示', '你点击了:' + title + " Tag:" + tag);
    }

    _onRecommendClick(wareId) {
        let url = 'http://item.m.jd.com/product/' + wareId + '.html';
        this.props.nav.push({
            id: 'webview',
            title: 'webiew',
            url: url
        });
    }

    _renderRow(rowData) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableWithoutFeedback style={{ flex: 1, alignItems: 'center' }}
                    onPress={() => { this._onRecommendClick(rowData.left.wareId) } }>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image resizeMode={'stretch'} source={{ uri: rowData.left.imageurl }}
                            style={{ width: len, height: len }}/>
                        <Text numberOfLines={2} style={styles.recommendTitle}>{rowData.left.wname}</Text>
                        <View style={{ width: len, borderWidth: 0.5, borderColor: '#d7d7d7' }}/>
                        <View
                            style={{ flexDirection: 'row', width: len, marginTop: 6, marginBottom: 22, alignItems: 'flex-start' }}>
                            <Text style={styles.priceText}>￥{rowData.left.jdPrice}</Text>
                            <TouchableWithoutFeedback>
                                <View style={{
                                    width: 50, height: 18, borderWidth: 1, borderColor: '#999999', borderRadius: 3, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{ color: '#999999', fontSize: 12, textAlign: 'center' }}>看相似</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={{ flex: 1, alignItems: 'center' }}
                    onPress={() => { this._onRecommendClick(rowData.right.wareId) } }>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image resizeMode={'stretch'} source={{ uri: rowData.right.imageurl }}
                            style={{ width: len, height: len }}/>
                        <Text numberOfLines={2} style={styles.recommendTitle}>{rowData.right.wname}</Text>
                        <View style={{ width: len, borderWidth: 0.5, borderColor: '#d7d7d7' }}/>
                        <View
                            style={{ flexDirection: 'row', width: len, marginTop: 6, marginBottom: 22, alignItems: 'flex-start' }}>
                            <Text style={styles.priceText}>￥{rowData.right.jdPrice}</Text>
                            <TouchableWithoutFeedback>
                                <View style={{
                                    width: 50, height: 18, borderWidth: 1, borderColor: '#999999', borderRadius: 3, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{ color: '#999999', fontSize: 12, textAlign: 'center' }}>看相似</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    render() {
        return (
            <ListView
                style={{ flex: 1, backgroundColor: 'white' }}
                dataSource={this.state.listData}
                renderRow={this._renderRow}
                >
            </ListView>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        height: 130,
        resizeMode: 'stretch'
    },
    menuView: {
        flexDirection: 'row',
        marginTop: 10
    },
    recommendTitle: {
        width: len,
        flexWrap: 'wrap',
        fontSize: 12,
        color: 'black',
        flex: 1,
        marginTop: 8,
        marginBottom: 8,
        height: 30
    },
    priceText: {
        flex: 1,
        alignSelf: 'flex-start',
        textAlign: 'left',
        fontSize: 13,
        color: '#f15353'
    }
});