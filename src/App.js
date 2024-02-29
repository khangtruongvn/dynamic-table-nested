import { Button, Form, Input, Space, Table } from "antd";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_VALUE = {
  items: [
    {
      id: uuidv4(),
      parentIndex: null,
      title: "Tổng doanh thu",
      value: 100,
      children: [
        {
          id: uuidv4(),
          value: 100,
          parentIndex: [0],
          title: "Doanh thu bán nội bộ",
          children: [
            {
              id: uuidv4(),
              value: 100,
              parentIndex: [0, 0],
              title: "Doanh thu bán hàng",
              children: [
                {
                  id: uuidv4(),
                  value: 100,
                  parentIndex: [0, 0, 0],
                  title: "Mặt hàng x",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default function App() {
  const { control, watch, setValue, handleSubmit } = useForm({
    defaultValues: DEFAULT_VALUE,
  });
  const { append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const dataSource = watch("items");

  const columns = () => {
    return [
      {
        width: 80,
        title: "Key",
        key: "id",
        dataIndex: "id",
        // render: (value) => value.slice(0, 5),
      },
      {
        width: 300,
        title: "Title",
        key: "title",
        dataIndex: "title",
        render: (value, record, recordIndex) => {
          const { parentIndex } = record;
          let name = "";

          if (parentIndex) {
            name = `items.`;
            parentIndex.forEach((index) => {
              name += `${index}.children.`;
            });
            name += `${recordIndex}.title`;
          } else {
            name = `items.${recordIndex}.title`;
          }

          if (record.isEdit) {
            return (
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <Form.Item style={{ margin: 0 }}>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
            );
          }
          return value;
        },
      },
      {
        width: 300,
        title: "Value",
        key: "value",
        dataIndex: "value",
      },
      {
        width: 200,
        title: "Action",
        dataIndex: "action",
        render: (_, record, recordIndex) => {
          const { parentIndex } = record;
          let name = "";

          if (parentIndex) {
            name = `items.`;
            parentIndex.forEach((index) => {
              name += `${index}.children.`;
            });
            name += `${recordIndex}.isEdit`;
          } else {
            name = `items.${recordIndex}.isEdit`;
          }

          
          return (
            <Space>
              <Button onClick={() => handleAddSameLevel(record.parentIndex)} >
                Thêm cùng cấp
              </Button>
              <Button
                onClick={() =>
                  handleAddChildren(record.parentIndex, recordIndex)
                }
              >
                Thêm con
              </Button>
              {record.isEdit && (
                <Button onClick={() => setValue(name, false)}>Save</Button>
              )}
            </Space>
          );
        },
      },
    ];
  };

  const handleAddSameLevel = (parentIndex) => {
    const data = JSON.parse(JSON.stringify(dataSource));
    if (parentIndex === null) {
      setValue("items", [
        ...data,
        {
          id: uuidv4(),
          parentIndex: null,
          title: "",
          value: 100,
          isEdit: true,
        },
      ]);
    }

    if (parentIndex) {
      const index = {};
      parentIndex.forEach((value, idx) => {
        index[`level_${idx + 1}`] = value;
      });

      const countLevel = parentIndex.length;

      switch (countLevel) {
        case 1:
          data[index.level_1] = {
            ...data[index.level_1],
            children: [
              ...(data[index.level_1]?.children || []),
              {
                id: uuidv4(),
                parentIndex: parentIndex,
                title: "",
                value: 100,
                isEdit: true,
              },
            ],
          };
          break;
        case 2:
          data[index.level_1].children[index.level_2] = {
            ...data[index.level_1].children[index.level_2],
            children: [
              ...(data[index.level_1].children[index.level_2].children || []),
              {
                id: uuidv4(),
                parentIndex: parentIndex,
                title: "",
                value: 100,
                isEdit: true,
              },
            ],
          };
          break;
        case 3:
          data[index.level_1].children[index.level_2].children[index.level_3] =
            {
              ...data[index.level_1].children[index.level_2].children[
                index.level_3
              ],
              children: [
                ...(data[index.level_1].children[index.level_2].children[
                  index.level_3
                ].children || []),
                {
                  id: uuidv4(),
                  parentIndex: parentIndex,
                  title: "",
                  value: 100,
                  isEdit: true,
                },
              ],
            };
          break;
        default:
          break;
      }
      setValue("items", data);
    }
  };

  const handleAddChildren = (parentIndex, recordIndex) => {
    const data = JSON.parse(JSON.stringify(dataSource));
    if (parentIndex === null) {
      data[recordIndex] = {
        ...data[recordIndex],
        children: [
          ...(data[recordIndex].children || []),
          {
            id: uuidv4(),
            parentIndex: [recordIndex],
            title: "",
            value: 100,
            isEdit: true,
          },
        ],
      };
      setValue("items", data);
    }

    if (parentIndex) {
      const index = {};
      parentIndex.push(recordIndex)
      parentIndex.forEach((value, idx) => {
        index[`level_${idx + 1}`] = value;
      });
      const countLevel = parentIndex.length;
      switch (countLevel) {
        case 1:
          data[index.level_1] = {
            ...data[index.level_1],
            children: [
              ...(data[index.level_1]?.children || []),
              {
                id: uuidv4(),
                parentIndex: parentIndex,
                title: "",
                value: 100,
                isEdit: true,
              },
            ],
          };
          break;
        case 2:
          data[index.level_1].children[index.level_2] = {
            ...data[index.level_1].children[index.level_2],
            children: [
              ...(data[index.level_1].children[index.level_2].children || []),
              {
                id: uuidv4(),
                parentIndex: parentIndex,
                title: "",
                value: 100,
                isEdit: true,
              },
            ],
          };
          break;
        case 3:
          data[index.level_1].children[index.level_2].children[index.level_3] =
            {
              ...data[index.level_1].children[index.level_2].children[
                index.level_3
              ],
              children: [
                ...(data[index.level_1].children[index.level_2].children[
                  index.level_3
                ].children || []),
                {
                  id: uuidv4(),
                  parentIndex: parentIndex,
                  title: "",
                  value: 100,
                  isEdit: true,
                },
              ],
            };
          break;
        default:
          break;
      }

      setValue('items', data)
    }
  };

  return (
    <Form
      initialValues={DEFAULT_VALUE}
      onFinish={handleSubmit((formValue) => console.log(formValue))}
    >
      <Table
        id="table"
        bordered
        rowKey="id"
        columns={columns({ remove, append })}
        dataSource={dataSource}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
