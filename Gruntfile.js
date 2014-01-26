module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.initConfig({
        copy: {
            dist: {
                files: [
                    { src: ['elevation.profile.js'], dest: 'dist/', filter: 'isFile' }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/elevation.profile.min.js': ['elevation.profile.js']
                }
            }
        },
        less: {
            dist: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    'dist/elevation.profile.css': 'elevation.profile.less'
                }
            }
        }
    });

    grunt.registerTask("dist", ['copy', 'uglify', 'less']);
}
