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
                        cdn: 'https://www.d12eibkmyydrmn.cloudfront.net/'
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
                        cdn: 'https://www.d3ce3d057nh52e.cloudfront.net/'
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