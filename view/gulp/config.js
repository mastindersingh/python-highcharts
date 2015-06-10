var dest = "../charts";
//var dest = "./build";
var src = './src';

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    },
    sass: {
        src: src + "/sass/**/*.{sass,scss}",
        dest: dest,
        settings: {
            indentedSyntax: true, // Enable .sass syntax!
            imagePath: 'images' // Used by the image-url helper
        }
    },
    images: {
        src: src + "/images/**",
        dest: dest + "/images"
    },
    markup: {
        src: src + "/htdocs/**",
        dest: dest
    },
    iconFonts: {
        name: 'Gulp Starter Icons',
        src: src + '/icons/*.svg',
        dest: dest + '/fonts',
        sassDest: src + '/sass',
        template: './gulp/tasks/iconFont/template.sass.swig',
        sassOutputName: '_icons.sass',
        fontPath: 'fonts',
        className: 'icon',
        options: {
            fontName: 'Post-Creator-Icons',
            appendCodepoints: true,
            normalize: false
        }
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [
            {
                entries: src + '/javascript/page.js',
                dest: dest,
                outputName: 'page.js'
                // list of externally available modules to exclude from the bundle
                //external: ['jquery']
            },
            {
                entries: src + '/javascript/async.js',
                dest: dest,
                outputName: 'async.js'
                // list of externally available modules to exclude from the bundle
                //external: ['jquery']
            },
            {
                entries: src + '/javascript/require.js',
                dest: dest,
                outputName: 'require.js'
            },
            {
                entries: src + '/javascript/lib.js',
                dest: dest,
                outputName: 'lib.js'
            }
        ]
    },
    production: {
        cssSrc: dest + '/*.css',
        jsSrc: dest + '/*.js',
        htmlSrc: dest + '/*.html',
        dest: dest
    }
};
