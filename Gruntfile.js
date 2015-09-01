module.exports = function(grunt) {

    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', './js/{,*/}*.js'],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },
        clean: {
            revisions: [
                './js/{,*/}*.min.*.js',
                './css/*.min.*.css'
            ],
            minified: [
                './js/{,*/}*.min.js',
                './css/*.min.css'
            ]
        },
        uglify: {
            dist: {
                src: ['./js/{,*/}*.js'],
                dest: './js/script-all.min.js'
            }
        },
        jsObfuscate: {
            dist: {
                options: {
                    concurrency: 2,
                    keepLinefeeds: false,
                    keepIndentations: false,
                    encodeStrings: true,
                    encodeNumbers: true,
                    moveStrings: true,
                    replaceNames: true,
                    variableExclusions: ['^_get_', '^_set_', '^_mtd_']
                },
                files: {
                    './js/script-all-final.min.js': ['<%= uglify.dist.dest %>']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                src: ['./css/{,*/}*.css'],
                dest: './css/style-all.min.css'
            }
        },
        filerev: {
            css: {
                src: ['<%= cssmin.target.dest %>'],
                dest: './css/'
            },
            js: {
                src: ['<%= uglify.dist.dest %>'],
                dest: './js/'
            }
        },
        processhtml: {
            local: {
                // Do Nothing
            },
            dev: {
                options: {
                    data: {
                        env: 'dev',
                        cdn: ''
                    },
                    process: true
                },
                files: {
                    'index.html': ['index.html']
                }
            },
            qa: {
                options: {
                    data: {
                        env: 'qa',
                        cdn: ''
                    },
                    process: true
                },
                files: {
                    'index.html': ['index.html']
                }
            },
            beta: {
                options: {
                    data: {
                        env: 'beta',
                        cdn: 'https://beta-thirdeyestatic.proptiger-ws.com/'
                    },
                    process: true
                },
                files: {
                    'index.html': ['index.html']
                }
            },
            prod: {
                options: {
                    data: {
                        env: 'prod',
                        cdn: 'https://thirdeyestatic.proptiger.com/'
                    },
                    process: true
                },
                files: {
                    'index.html': ['index.html']
                }
            }
        },
        replace: {
            dist: {
                src: ['./index.html'],
                overwrite: true,
                replacements: [{
                    from: /[a-zA-Z0-9\-]*\.min[.a-zA-z0-9]*\.(css|js)/g,
                    to: function(filename) {
                        var files = grunt.file.expand('./{,*/}*.min.*.*');
                        var found = false;
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            var f, file1 = file.split('/');
                            var file2 = filename.split('/');
                            f = file1[file1.length - 1];
                            file1 = f.split('.')[0];
                            file2 = file2[file2.length - 1].split('.')[0];
                            if (file1 === file2) {
                                found = true;
                                grunt.log.warn(f);
                                return f;
                            }
                        }
                        if (!found) {
                            return filename;
                        }
                    }
                }]
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }

    });

    //grunt.loadNpmTasks('js-obfuscator');

    grunt.registerTask('base', [
        'clean',
        'jshint',
        'uglify',
        'cssmin',
        'filerev',
        'clean:minified'
    ]);

    grunt.registerTask('default', [
        'base',
        'processhtml:local'
    ]);

    grunt.registerTask('dev', [
        'base',
        'processhtml:dev',
        'replace'
    ]);

    grunt.registerTask('qa', [
        'base',
        'processhtml:qa',
        'replace'
    ]);

    grunt.registerTask('beta', [
        'base',
        'processhtml:beta',
        'replace'
    ]);

    grunt.registerTask('prod', [
        'base',
        'processhtml:prod',
        'replace'
    ]);
};