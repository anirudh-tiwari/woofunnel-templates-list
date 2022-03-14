import classNames from "classnames"
import './style.scss'

/**
 * 
 * @param {string} className 
 * @param {string} size // avaiable size l, xl, xxl 
 * @returns 
 */
const BWFLoading = ({className='', size='', style={}}) => {
    return (
        <div
            className={
                classNames('bwf-loading-ring', className, { [`bwf-loading-${size}`]:size })
            }
            style={style}
        >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default BWFLoading
