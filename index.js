#!/usr/bin/env node --harmony
'use strict';

let program = require('commander'),
    fs = require('fs'),
    _ = require('lodash'),
    cmd = require('node-cmd'),
    Promise = require('promise');

function getFile(file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file, 'UTF-8', (error, data) => {
            let reg = /(?:require)\(["']\S*(?:["']\)*)/g;
            let fileList = data.match(reg);
            let moduleList = '';

            _.eachRight(fileList, (item) => {
                let reg = /gulp+[-a-zA-Z0-9]*/;
                let res = item.match(reg)[0];
                moduleList = moduleList + ' ' + res;
                fileList.pop();
                if(fileList.length === 0) {
                    resolve(moduleList);
                }
            })
        })
    })
}

program
    .arguments('<file>')
    .action((file) => {
        getFile(file).then(function(moduleList) {
            console.log("download modules" + moduleList);
            cmd.run('npm install' + moduleList + ' --save-dev');
        })
    })
    .parse(process.argv);
