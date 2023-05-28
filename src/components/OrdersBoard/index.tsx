import { Board, OrdersContainer } from './styles';
import { Order } from '../../types/Order';
import { useState } from 'react';
import { OderModal } from '../OrderModal';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';

interface OrdersBoardProps {
  icon: string;
  title: string;
  orders: Order[];
  onCancelOrder(orderId: string): void;
  onChangeStatus(orderId: string, status: Order['status']): void;
}


export function OrdersBoard({ icon, title, orders, onCancelOrder, onChangeStatus }: OrdersBoardProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | Order>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenOrder(order: Order) {
    setModalVisible(true);
    setSelectedOrder(order);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setSelectedOrder(null);
  }

  function handleChangeOrderStatus() {
    setIsLoading(true);

    const status = selectedOrder?.status == 'WAITING'
      ? 'IN_PRODUCTION'
      : 'DONE';

    api.patch(`/orders/${selectedOrder?._id}`, { status });
    toast.success(`o pedido da mesa ${selectedOrder?.table} teve o status alterado!`);
    onChangeStatus(selectedOrder!._id, status);
    setIsLoading(false);
    setModalVisible(false);

  }

  async function handleCancelOrder() {
    setIsLoading(true);
    // await new Promise(resolve => setTimeout(resolve, 3000));
    await api.delete(`/orders/${selectedOrder?._id}`);

    toast.success(`o pedido da mesa ${selectedOrder?.table} foi cancelado`);
    onCancelOrder(selectedOrder!._id);
    setIsLoading(false);
    setModalVisible(false);
  }

  return (
    <Board>

      <OderModal
        visible={isModalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onCancelOrder={handleCancelOrder}
        isLoading={isLoading}
        onChangeOrderStatus={handleChangeOrderStatus}
      />

      <header>
        <span>{icon}</span>
        <span><strong>{title}</strong></span>
        <span>({orders.length})</span>
      </header>

      {orders.length > 0 && (
        <OrdersContainer>
          {orders.map((order) => (
            <button type='button' key={order._id} onClick={() => handleOpenOrder(order)}>
              <strong>Mesa {order.table}</strong>
              <strong>{order.products.length} itens</strong>
            </button>
          ))}
        </OrdersContainer>
      )}

    </Board>
  );
}
