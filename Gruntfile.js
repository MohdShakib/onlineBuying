var obfuscator = require('./grunt/obfuscator.js');

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
                './vendors/vendors-all.min.*.js',
                './css/*.min.*.css'
            ],
            minified: [
                './js/{,*/}*.min.js',
                './vendors/vendors-all.min.js',
                './css/*.min.css'
            ]
        },
        uglify: {
            js: {
                src: ['./js/{,*/}*.js'],
                dest: './js/script-ugly.min.js'
            },
            dist: {
                src: ['<%= obfuscator.dest %>'],
                dest: './js/script-all.min.js'
            },
            vendors: {
                src: ['./vendors/*.js'],
                dest: './vendors/vendors-all.min.js'
            }
        },
        obfuscator: {
            src: '<%= uglify.js.dest %>',
            dest: './js/script-obfuscate.min.js'
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
            },
            vendors: {
                src: ['<%= uglify.vendors.dest %>'],
                dest: './vendors/'
            }
        },
        processhtml: {
            local: {
                // Do Nothing
            },
            test: {
                options: {
                    data: {
                        env: 'prod',
                        cdn: ''
                    },
                    process: true
                },
                files: {
                    'index.html': ['index.html']
                }
            },
            dev: {
                options: {
                    data: {
                        env: 'dev',
                        cdn: '/4d-view/'
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
                        cdn: '/4d-view/'
                    },
                    process: true
                },
                files: {
                    'index.html': ['index.html']
                }
            },
            qaui: {
                options: {
                    data: {
                        env: 'qaui',
                        cdn: '/4d-view/'
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

    grunt.registerTask('base', [
        'clean',
        'jshint',
        'uglify:js',
        'uglify:vendors',
        'obfuscator',
        'uglify:dist',
        'cssmin',
        'filerev',
        'clean:minified'
    ]);

    grunt.registerTask('obfuscator', function() {
        var done = this.async();
        obfuscator(grunt.config.get('obfuscator').src,function(res){
            grunt.file.write(grunt.config.get('obfuscator').dest, res);
            done();
        }, function(){ console.log('Could not obfuscate'); });
    });

    grunt.registerTask('default', [
        'base',
        'processhtml:local'
    ]);

    grunt.registerTask('local', [
        'base',
        'processhtml:test',
        'replace'
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

    grunt.registerTask('qaui', [
        'base',
        'processhtml:qaui',
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
