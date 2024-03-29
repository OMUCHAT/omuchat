import { execa, execaSync } from 'execa';

execaSync('pnpm', ['--filter', 'ui', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});
execaSync('pnpm', ['--filter', 'i18n', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});
execaSync('pnpm', ['--filter', 'omu', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});
execaSync('pnpm', ['--filter', 'chat', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});

execa('pnpm', ['--filter', 'dash', 'dev'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'site', 'dev'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'ui', 'storybook'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'ui', 'watch'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'i18n', 'watch'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'omu', 'watch'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'chat', 'watch'], { stderr: process.stderr, stdout: process.stdout });
