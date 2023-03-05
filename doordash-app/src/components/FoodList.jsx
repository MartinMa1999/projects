import { Button, Card, List, message, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { addItemToCart, getMenus, getRestaurants } from "../utils";
import { PlusOutlined } from "@ant-design/icons";


const { Option } = Select;

const AddToCartButton = ({ itemId }) => {
  const [loading, setLoading] = useState(false);

  const AddToCart = () => {
    setLoading(true);
    addItemToCart(itemId)
      .then(() => message.success(`Successfully add item`))
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Tooltip title="Add to shopping cart">
      <Button
        loading={loading}
        type="primary"
        icon={<PlusOutlined />}
        onClick={AddToCart}
      />
    </Tooltip>
  );
};


const FoodList = () => {
    const [foodData, setFoodData] = useState([]); // 每一个餐厅的food，初始是一个空的array
    const [curRest, setCurRest] = useState(); // 现在正要查看的restaurant
    const [restaurants, setRestaurants] = useState([]); // 所有可以看到的餐厅
    const [loading, setLoading] = useState(false); // 加载menu的标志
    const [loadingRest, setLoadingRest] = useState(false); // 加载餐厅列表的标志
  
    useEffect(() => {
      setLoadingRest(true);
      getRestaurants()
        .then((data) => {
          setRestaurants(data);
        })
        .catch((err) => {
          message.error(err.message);
        })
        .finally(() => {
          setLoadingRest(false);
        });
    }, []);
  
    useEffect(() => {
      if (curRest) {
        setLoading(true);
        getMenus(curRest)
          .then((data) => {
            setFoodData(data);
          })
          .catch((err) => {
            message.error(err.message);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [curRest]);
  
    return (
      <>
        <Select
          value={curRest}
          onSelect={(value) => setCurRest(value)}
          placeholder="Select a restaurant"
          loading={loadingRest}
          style={{ width: 300 }}
          onChange={() => {}}
        >
          {restaurants.map((item) => {
            return <Option value={item.id}>{item.name}</Option>;
          })}
        </Select>
        {curRest && (
          <List
            style={{ marginTop: 20 }}
            loading={loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 3,
              xxl: 3,
            }}
            dataSource={foodData}
            renderItem={(item) => (
              <List.Item>
                <Card
                  title={item.name}
                  extra={<AddToCartButton itemId={item.id} />}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ height: 340, width: "100%", display: "block" }}
                  />
                  {`Price: ${item.price}`}
                </Card>
              </List.Item>
            )}
          />
        )}
      </>
    );
};

export default FoodList