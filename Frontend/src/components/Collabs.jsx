import Avator from 'react-avatar'

const Collabs = ({userName})=>{
    return(
        <div className='flex items-center gap-1 mb-2 border-b-2 border-gray-400 py-2'>
            <Avator className=''
            name={userName} round={15} size={35}></Avator>
            <span className='text-gray-200 font-bold '>{userName}</span>
        </div>
    )
}
export default Collabs