import ProjectsList from './ProjectsList';

export default function AllProjects() {
    return (
        <div id='all-projects' className='jump-link mb-56'>
            <div className='flex flex-col items-center'>
                <h2 className='text-5xl font-[400]'>All Projects</h2>
            </div>

            <ProjectsList />
        </div>
    );
}
