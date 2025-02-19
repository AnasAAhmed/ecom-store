import { AiOutlineStar } from "react-icons/ai";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRatings = ({ rating }: { rating: number }) => {

    const ratingStar = Array.from({ length: 5 }, (_, index) => {
        let number = index + 0.5;
        return (
            <span  key={index}>
                {rating >= index + 1 ? (
                    <FaStar className="text-blue-500 " />
                ) : rating >= number ? (

                    <FaStarHalfAlt className="text-blue-500 " />
                ) : (
                    <AiOutlineStar className="text-blue-500 mt-[0.15rem] text-[1.1rem]" />
                )}
            </span>
        )
    })

    return (
        <div className="flex items-center ">
            {ratingStar}
            {/* <span className="mx-1 mt-[2px]">({rating})</span> */}
        </div>
    );
};

export default StarRatings;