module.exports = function(grunt) {
    grunt.initConfig({
        // # files that our tasks will use
        files: {
            html: {
                src: "app/index.html",
                dev: "generated/index.html"
            },
            images: {
                src: "**/**",
                dev: "generated/images/"
            },
            sass: {
                src: "app/sass/",
                dev: "generated/css/"
            },
            js: {
                src: ["app/js/app.js", "app/js/**/*.js"],
                vendors: ["bower_components/jquery/dist/jquery.js"]
            }
        },
        //task configuration
        compass: {
            dev: {
                options: {
                    noLineComments: true,
                    outputStyle: "expanded",
                    // outputStyle :"compressed",
                    httpImagesPath: '/images/',
                    imagesDir: 'app/images/',
                    // relativeAssets:true,
                    require: ['susy', 'breakpoint'],
                    sassDir: '<%= files.sass.src %>',
                    cssDir: '<%= files.sass.dev %>'
                }
            }
        },
        uglify: {
            generated: {
                options: {
                    mangle: {
                        except: ['jQuery']
                    },
                    sourceMap: true,
                    sourceMapName: 'generated/sourcemap.map',
                    sourceMapIncludeSources:true
                },
                src: ["<%= files.js.vendors %>", "<%= files.js.src %>"],
                dest: "generated/js/app.min.js"
            }
        },
        copy: {
            html: {
                files: [{
                    src: "<%=files.html.src%>",
                    dest: "<%=files.html.dev%>"
                }, {
                    expand: true,
                    cwd: 'app/images/',
                    src: "<%=files.images.src%>",
                    dest: "<%=files.images.dev%>"
                }]
            }
        },
        server: {
            base: "<%= process.env.SERVER_BASE || 'generated'%>",
            web: {
                port: 8000
            }
        },
        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ["<%= files.html.src %>"],
                tasks: ["copy"]
            },
            js: {
                files: ["<%= files.js.src %>"],
                tasks: ["uglify:generated"]
            },
            compass: {
                files: ["<%= files.sass.src %>/*.scss"],
                tasks: ["compass:dev"]
            },
            grunt: {
                files: ["Gruntfile.js"]
            }
        }
    });
    grunt.loadTasks("tasks");
    // # Loads all plugins that match "grunt-", in this case all of our current plugins
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);
    
    grunt.registerTask("default", ["compass:dev", "uglify:generated", "copy:html", "server", "watch"]);
   }