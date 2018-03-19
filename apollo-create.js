#!/usr/bin/env node

const github = require('github-download');
const fs = require('fs-extra');
const exec = require('child_process').exec;

if (process.argv.length> 3) {
    return console.error('> Too many args');
}

const dest = process.argv[2] === undefined ? process.cwd() : process.cwd() +'/'+ process.argv[2];
const temp = '/tmp/apollo-theme-'+ Date.now();

// Check if dir already exists
if (process.argv[2] && fs.existsSync(dest)) {
    return console.error('> dir already exists');
}

const settings = {
    user: 'marcnewport',
    repo: 'apollo',
    ref: 'master'
};

console.log('> Fetching apollo theme...');

github(settings, temp)
    .on('error', function(err) {
        console.error('> Something went wrong', err);
    })
    .on('end', function() {
        fs.copySync(temp, dest);
        fs.remove(temp);
        console.log('> Apollo theme added in', dest);

        exec('npm install', {
            cwd: dest
        }, function(err)  {
            if (err) console.error('> Something went wrong', err);
        })
        .stdout.pipe(process.stdout);
    });
