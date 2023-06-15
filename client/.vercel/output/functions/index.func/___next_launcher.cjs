"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The Next.js builder can emit the project in a subdirectory depending on how
// many folder levels of `node_modules` are traced. To ensure `process.cwd()`
// returns the proper path, we change the directory to the folder with the
// launcher. This mimics `yarn workspace run` behavior.
process.chdir(__dirname);
const region = process.env.VERCEL_REGION || process.env.NOW_REGION;
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = region === 'dev1' ? 'development' : 'production';
}
if (process.env.NODE_ENV !== 'production' && region !== 'dev1') {
    console.warn(`Warning: NODE_ENV was incorrectly set to "${process.env.NODE_ENV}", this value is being overridden to "production"`);
    process.env.NODE_ENV = 'production';
}
process.env.__NEXT_PRIVATE_PREBUNDLED_REACT = "next"
// eslint-disable-next-line
const NextServer = require('next/dist/server/next-server.js').default;
const nextServer = new NextServer({
    // @ts-ignore __NEXT_CONFIG__ value is injected
    conf: {"env":{},"webpack":null,"eslint":{"ignoreDuringBuilds":false},"typescript":{"ignoreBuildErrors":false,"tsconfigPath":"tsconfig.json"},"distDir":".next","cleanDistDir":true,"assetPrefix":"","configOrigin":"next.config.js","useFileSystemPublicRoutes":true,"generateEtags":true,"pageExtensions":["tsx","ts","jsx","js"],"poweredByHeader":true,"compress":false,"analyticsId":"","images":{"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","loaderFile":"","domains":[],"disableStaticImages":false,"minimumCacheTTL":60,"formats":["image/webp"],"dangerouslyAllowSVG":false,"contentSecurityPolicy":"script-src 'none'; frame-src 'none'; sandbox;","contentDispositionType":"inline","remotePatterns":[],"unoptimized":false},"devIndicators":{"buildActivity":true,"buildActivityPosition":"bottom-right"},"onDemandEntries":{"maxInactiveAge":15000,"pagesBufferLength":2},"amp":{"canonicalBase":""},"basePath":"","sassOptions":{},"trailingSlash":false,"i18n":null,"productionBrowserSourceMaps":false,"optimizeFonts":true,"excludeDefaultMomentLocales":true,"serverRuntimeConfig":{},"publicRuntimeConfig":{},"reactStrictMode":false,"httpAgentOptions":{"keepAlive":true},"outputFileTracing":true,"staticPageGenerationTimeout":60,"swcMinify":true,"experimental":{"clientRouterFilter":true,"clientRouterFilterRedirects":false,"fetchCacheKeyPrefix":"","middlewarePrefetch":"flexible","optimisticClientCache":true,"manualClientBasePath":false,"legacyBrowsers":false,"newNextLinkBehavior":true,"cpus":7,"memoryBasedWorkersCount":false,"sharedPool":true,"isrFlushToDisk":true,"workerThreads":false,"pageEnv":false,"optimizeCss":false,"nextScriptWorkers":false,"scrollRestoration":false,"externalDir":false,"disableOptimizedLoading":false,"gzipSize":true,"swcFileReading":true,"craCompat":false,"esmExternals":true,"appDir":true,"isrMemoryCacheSize":52428800,"fullySpecified":false,"outputFileTracingRoot":"/Users/bluescreen/personal/projects/RL-Web-App/client","swcTraceProfiling":false,"forceSwcTransforms":false,"largePageDataBytes":128000,"adjustFontFallbacks":false,"adjustFontFallbacksWithSizeAdjust":false,"typedRoutes":false,"instrumentationHook":false,"trustHostHeader":true},"configFileName":"next.config.js"},
    dir: '.',
    minimalMode: true,
    customServer: false,
});
const requestHandler = nextServer.getRequestHandler();
module.exports = async (req, res) => {
    try {
        // entryDirectory handler
        await requestHandler(req, res);
    }
    catch (err) {
        console.error(err);
        // crash the lambda immediately to clean up any bad module state,
        // this was previously handled in ___vc_bridge on an unhandled rejection
        // but we can do this quicker by triggering here
        process.exit(1);
    }
};
