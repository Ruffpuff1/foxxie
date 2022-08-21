import { ReactNode } from 'react';

export default function Code({ children, commandLine, lang = 'tsx' }: Props) {
    if (commandLine) {
        return (
            <div className='m-[16px]'>
                <pre className='max-w-[80ch] overflow-x-scroll break-words bg-[#f1f3f4] p-[24px] font-mono text-[14px]'>
                    <span className='text-[#D73A4A]'>$ </span>
                    {children}
                </pre>
            </div>
        );
    }

    return (
        <div className='m-[16px]'>
            <pre className='max-w-[80ch] overflow-x-scroll break-words bg-[#f1f3f4] p-[24px] font-mono text-[14px]'>{parse(children)}</pre>
        </div>
    );
}

function parse(children: ReactNode) {
    const result = Array.isArray(children) ? children.map(parseJSXTSX) : parseJSXTSX(children);
    return result;
}

function parseJSXTSX(children: ReactNode) {
    const baseString = children?.toString();
    if (baseString === ' ') return <br key={baseString} />;
    if (baseString === '<tab>') return <span>&ensp;</span>;

    const string = baseString?.trim();

    if (!string) return null;

    if (string.startsWith('//'))
        return (
            <span key={string}>
                <span className='text-[#6A737D]'>{string}</span>
                <br />
            </span>
        );

    const hasSemi = string.endsWith(';');

    if (['import', 'type', 'from', 'const', 'interface', 'default'].includes(string)) {
        return (
            <span key={string}>
                <span className='text-[#D73A4A]'>{string} </span>
                {hasSemi && <br />}
            </span>
        );
    }

    if (['='].includes(string)) {
        return (
            <span key={string}>
                <span className='text-[#D73A4A]'>{string} </span>
            </span>
        );
    }

    const requireReg = /require\(['"`](?<pack>[@A-z\/]+)['"`]\);?/g;
    const requireRegResult = requireReg.exec(string);

    if (requireRegResult !== null) {
        const { pack } = requireRegResult.groups!;

        return (
            <span key={string}>
                <span>
                    <span className='text-[#764AC4]'>{'require'}</span>
                    <span className='text-[#015CC5]'>{'('}</span>
                    <span>{`'${pack}'`}</span>
                    <span className='text-[#015CC5]'>{')'}</span>;{' '}
                </span>
                {hasSemi && <br />}
            </span>
        );
    }

    const importReg = /{ (?<imp>[A-z]+) }/g;
    const importRegResult = importReg.exec(string);

    if (importRegResult !== null) {
        const { imp } = importRegResult.groups!;

        return (
            <span key={string}>
                <span>
                    <span className='text-[#025BC6]'>{'{'}</span> <span>{imp}</span> <span className='text-[#025BC6]'>{'}'}</span>{' '}
                </span>
                {hasSemi && <br />}
            </span>
        );
    }

    const stringSemiReg = /'(?<text>[A-z@\/]+)';/g;
    const stringSemiRegResult = stringSemiReg.exec(string);

    if (stringSemiRegResult !== null) {
        const { text } = stringSemiRegResult.groups!;

        return (
            <span key={string}>
                <span>
                    <span className='text-[#022F62]'>{`'${text}'`}</span>
                    <span className='text-[#24292F]'>;</span>{' '}
                </span>
                {hasSemi && <br />}
            </span>
        );
    }

    return (
        <span key={string}>
            {`${string} `}
            {hasSemi && <br />}
        </span>
    );
}

interface Props {
    children: ReactNode;
    commandLine?: boolean;
    lang?: 'tsx' | 'jsx';
}
