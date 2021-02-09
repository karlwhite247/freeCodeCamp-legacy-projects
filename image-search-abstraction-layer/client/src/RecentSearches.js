import React from 'react';

const formatDate = (date) => date.toLocaleDateString();

const RecentSearches = (props) => {
	const list = props.items.sort((a,b) => new Date(b.doc.searchDate) - new Date(a.doc.searchDate)).slice(0,10);
	return (
		<div className="recent">
		  {list.map(item => (
				<div className="item" key={item.doc._id}>
					<button
						className="item__btn"
						onClick={() => {
		  				props.setSearchTerm(item.doc.searchVal);
		  				props.search(item.doc.searchVal, 1);
		  			}}
					>
						<div className="item__val">{item.doc.searchVal}</div>
						<div className="item__date">{formatDate(new Date(item.doc.searchDate))}</div>
					</button>
				</div>
				))}
		</div>
	)
};

export default RecentSearches;