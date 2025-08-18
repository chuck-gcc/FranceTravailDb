import { Extract_date_roll_back} from "../src/class/date_roll_back"
import {Extract_day} from "../src/class/extraction_roll_back"
import {ReqStatus} from "../src/class/request_status"
import {sleep} from "../src/utils/utils"
import assert from "assert"
import { Token, getToken } from "../token/token"
import dotenv from "dotenv"
import { escape } from "querystring"

function roll_back_date_test()
{
    const date_roll = new Extract_date_roll_back();
    for(let i = 0; i < 10000;i++)
    {
        date_roll.display();
        date_roll.set_new_date()
        assert(date_roll.dateLeft < date_roll.dateRight)
        if(date_roll.dateRight.getDate() != 1)
        {
            assert(date_roll.dateLeft.getDate() == date_roll.dateRight.getDate() - 1)
        }
    }
}

async function roll_back_range_test(n: number)
{
    const token = await getToken();
    assert(token != null);
    const date_roll = new Extract_date_roll_back();

    const extract: Extract_day | null = new Extract_day(token,"74",date_roll);
    for(let i = 0; i < n; i++)
    {
        console.log(`Iteration ${i}`);
        await extract.get_header_data();
        extract.create_promise_url()
        extract.display();
        //if(extract.incomplet_batch <= 1)
        extract.get_promise_len();
        extract.display_url();
        date_roll.set_new_date();
        extract.reinit(token,"74",date_roll);
        //sleep(500);
    }
    
}

async function test_unit()
{
    dotenv.config();
    //roll_back_date_test();
    await roll_back_range_test(1000);

}

test_unit();
