import { MdSend } from 'react-icons/md';

const emailRegex = new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);

export default function EmailStep({ email, setEmail, submitEmail, step }: Props) {
    const percent = parseInt(step, 10) < 4 ? '110%' : parseInt(step, 10) > 4 ? '-110%' : '0px';
    const validEmail = emailRegex.test(email);

    return (
        <div style={{ transform: `translate3d(${percent},0px,0px)` }} className={`slide-step absolute mt-10 flex w-full items-center justify-center space-x-3`}>
            <input
                type='email'
                name='email'
                autoComplete='email'
                onChange={e => {
                    setEmail(e.target.value);
                }}
                placeholder='you@example.com'
                className={`w-56 rounded-md border bg-transparent p-1 ${email === '' || email.length <= 3 || validEmail ? '' : 'border-b-2 border-b-red-500'}`}
            />
            <button
                onClick={() => {
                    if (!validEmail) return;
                    submitEmail();
                }}
            >
                <MdSend className={`text-xl duration-500 hover:text-blue-500 ${validEmail ? 'opacity-100' : 'cursor-default opacity-0'}`} />
            </button>
        </div>
    );
}

interface Props {
    setEmail: (email: string) => void;
    submitEmail: () => void;
    email: string;
    step: string;
}

/** // phone input tba
 * 
 * <input
                id="phone"
                name="Phone number"
                type="tel"
                autoComplete="tel-national"
                pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
                placeholder="+12345678910"
                maxLength={15}
                onChange={(e) => setPhone(e.target.value)}
              />
 */
