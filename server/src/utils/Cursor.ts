//@ts-nocheck
import { ObjectId } from 'mongodb'


class Cursor{

	public static decode(cursor: string) {
       
        const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
        const parts = decoded.split("|");
       
        return parts.map(part => {

            let [field, value] = part.split(":");

            if(field == '_id'){

            	value = new ObjectId(value)
            }

            return { field, value };
        });
    }

	public static getCompoundCursor(cursor: string | null, cursor_fields: [{ field: string, order: number }]) {
	   
	    if (!cursor) return [];

	    const decoded = this.decode(cursor);

	    const conditions = cursor_fields.map((cursor_field) => {
	      
	        const { field, order } = cursor_field;
	        const cursor_value = decoded.find(dec => dec.field === field).value;
	        const operator = order === 1 ? '$gt' : '$lt';
	        
	        return {
	            
	            [field]: { [operator]: cursor_value }
	        };
	    });

	    // Add a tie-breaking condition using the unique identifier
	   // const cursor_id = new ObjectId(decoded.find(dec => dec.field === '_id').value);
	   
	   // conditions.push({ _id: { '$gt': cursor_id }});


	    return [

	        { $match: { $and: conditions } }
	    ];
	}


	public static getNextCursor(results_field: string, max_results: number, cursor_fields: [{ field: string, order: number }]){

		cursor_fields = cursor_fields.map((e)=>e.field)

		return [

			{

				$addFields: {

					[results_field]: { $slice: [`$${results_field}`, 0, max_results] },

					 next_cursor: {
	                    
	                    $cond: {

	                        if: { $gt: [ { $size: `$${results_field}` }, max_results ] },

	                        then: {

	                            $let: {

	                                vars: {

	                                    last_doc: { $arrayElemAt: [ `$${results_field}`, -2 ] } // Take the last document from the batch
	                                },

	                                in: {

	                                	 $arrayToObject: {

							                $filter: {

							                    input: { $objectToArray: "$$last_doc" },

							                    as: "item",

							                    cond: { $in: ["$$item.k", cursor_fields] } 
							                }
							            }
			                        }    
	                            
	                            }
	                        },

	                    	else: null
	                	}
	            	}
				}
			}
		]
	}

	public static getNextBatch(cursor: string | null, max_results : number, results_field : string, cursor_fields: [{ field: string, order: number }], results_pipeline?: any = [] ){

		const filter = cursor ? this.getCompoundCursor(cursor, cursor_fields) : [];

		const sort_object = cursor_fields.reduce((acc, { field, order }) => {
        	
        	acc[field] = order;
        	
        	return acc;
    	
    	}, {});



		return [

			...filter,

			{
				$facet:{

					[results_field]:[

						{ $sort: sort_object },

						{ $limit: max_results + 1 },

						...results_pipeline
					]
				}
			},

			...this.getNextCursor(results_field, max_results, cursor_fields)
		]
	}
}

export default Cursor
