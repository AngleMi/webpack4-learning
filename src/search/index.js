'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../images/logo.png';
import './search.less';
// import { a } from './tree-shaking.js'
class Search extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {
            Text: null
        }
    }

    loadComponent(){
        import('./text.js').then((text) => {
            this.setState({
                Text : text.default
            })
        })
    }
     render() {
        // const funcA = a()
        const { Text } = this.state;
        return (
            <div className="search-text">
            Text:{ Text ? <Text /> : null}
            {/* { funcA } */}
            搜索文件的内容hahhah<img src={logo} onClick={this.loadComponent.bind(this)} />
          </div>
        )
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);