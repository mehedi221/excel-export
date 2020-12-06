<?php

class Global_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function insert($table, $data = array()) {
        $this->db->insert($table, $data);
        return $this->db->insert_id();
    }

    public function save_batch($table, $data = array()) {
        return $this->db->insert_batch($table, $data);
    }

    public function update($table, $data, $where) {
        if ($this->db->table_exists('logs')) {
            $previous_data = (array) $this->get_row($table, $where);
            $update_data   = $data;
            $logs_data     = array(
                'user_id'           => get_current_user_id(),
                'table_name'        => $table,
                'controller_name'   => $this->router->fetch_class(),
                'method_name'       => $this->router->fetch_method(),
                'update_conditions' => json_encode($where),
                'previous_data'     => json_encode($previous_data),
                'update_data'       => json_encode($update_data),
                'added'             => date('Y-m-d H:i:s'),
            );
            $this->insert('logs', $logs_data);
        }
        $this->db->where($where);
        $this->db->update($table, $data);
        return TRUE;
    }

    public function delete($table, $where) {
        if ($this->db->table_exists('logs')) {
            $previous_data = $this->get($table, $where);
            $logs_data     = array(
                'user_id'           => get_current_user_id(),
                'table_name'        => $table,
                'controller_name'   => $this->router->fetch_class(),
                'method_name'       => $this->router->fetch_method(),
                'update_conditions' => json_encode($where),
                'log_type'          => 'delete',
                'previous_data'     => json_encode($previous_data),
                'added'             => date('Y-m-d H:i:s'),
            );
            $this->insert('logs', $logs_data);
        }
        if ($this->db->delete($table, $where)) {
            return $this->db->affected_rows();
        } else {
            return FALSE;
        }
    }

    public function get_var($sql) {
        $query = $this->db->query($sql);

        if ($query->num_rows() > 0) {
            $row = $query->row_array();

            return array_pop($row);
        }
    }

    public function get_result_by_sql($sql) {
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function get_row_by_sql($sql) {
        $query = $this->db->query($sql);
        return $query->row();
    }

    public function get_row($table, $where, $field_rows = '*', $order_by = false, $where_in = false) {
        $this->db->select($field_rows)->from($table);

        if (!empty($where)) {
            $this->db->where($where);
        }

        if (!empty($where_in)) {
            $this->db->where_in($where_in['key'], $where_in['values']);
        }

        if (!empty($order_by)) {
            $this->db->order_by($order_by['filed'], $order_by['order']);
        }

        $query = $this->db->get();
        if ($query->result()) {
            return $query->row();
        } else {
            return FALSE;
        }
    }

    public function get_row_join($table, $where = FALSE, $field_rows = '*', $order_by = FALSE, $where_in_parmas = FALSE, $join_parmas = FALSE, $group_by = FALSE, $having = FALSE) {
        $this->db->select($field_rows);
        $this->db->from($table);

        if (!empty($join_parmas)) {
            foreach ($join_parmas as $join_item) {
                if (isset($join_item['type'])) {
                    $this->db->join($join_item['table'], $join_item['relation'], $join_item['type']);
                } else {
                    $this->db->join($join_item['table'], $join_item['relation']);
                }
            }
        }

        if (!empty($where)) {
            $this->db->where($where);
        }

        if (!empty($where_in_parmas)) {
            foreach ($where_in_parmas as $where_in) {
                $this->db->where_in($where_in['key'], $where_in['values']);
            }
        }

        if (!empty($group_by)) {
            $this->db->group_by($group_by);
        }

        if(!empty($having)){
            $this->db->having($having);
        }

        if (!empty($order_by)) {
            $this->db->order_by($order_by['field'], $order_by['order']);
        }

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            return $query->row();
        }
    }

    public function get($table, $where = false, $field_rows = '*', $limit = false, $order_by = false, $where_in = false, $group_by = false, $like = false) {
        $this->db->select($field_rows)->from($table);

        if (!empty($where)) {
            $this->db->where($where);
        }

        if (!empty($where_in)) {
            $this->db->where_in($where_in['key'], $where_in['values']);
        }

        if (!empty($like)) {
            $this->db->like($like);
        }

        if (!empty($limit)) {
            $this->db->limit($limit['limit'], $limit['start']);
        }

        if (!empty($group_by)) {
            $this->db->group_by($group_by);
        }

        if (!empty($order_by)) {
            $this->db->order_by($order_by['filed'], $order_by['order']);
        }

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result();
        } else {
            return false;
        }
    }

    public function get_join($table, $where = FALSE, $field_rows = '*', $limit = FALSE, $order_by = FALSE, $where_in_parmas = FALSE, $join_parmas = FALSE, $group_by = FALSE, $like = FALSE, $having = FALSE) {
        $this->db->select($field_rows);
        $this->db->from($table);

        if (!empty($join_parmas)) {
            foreach ($join_parmas as $join_item) {
                if (isset($join_item['type'])) {
                    $this->db->join($join_item['table'], $join_item['relation'], $join_item['type']);
                } else {
                    $this->db->join($join_item['table'], $join_item['relation']);
                }
            }
        }

        if (!empty($where)) {
            $this->db->where($where);
        }

        if (!empty($where_in_parmas)) {
            if (isset($where_in_parmas['key']) && isset($where_in_parmas['values'])) {
                $this->db->where_in($where_in_parmas['key'], $where_in_parmas['values']);
            } else {
                foreach ($where_in_parmas as $where_in) {
                    $this->db->where_in($where_in['key'], $where_in['values']);
                }
            }
        }

        if (!empty($like)) {
            $this->db->like($like);
        }

        if (!empty($limit)) {
            $this->db->limit($limit['limit'], $limit['start']);
        }

        if (!empty($group_by)) {
            $this->db->group_by($group_by);
        }

        if(!empty($having)){
            $this->db->having($having);
        }

        if (!empty($order_by)) {
            $this->db->order_by($order_by['field'], $order_by['order']);
        }

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            return $query->result();
        }
    }

    public function get_result_array($table, $where = false, $field_rows = '*', $limit = false, $order_by = false, $where_in = false, $group_by = false) {
        $this->db->select($field_rows)->from($table);

        if (!empty($where)) {
            $this->db->where($where);
        }

        if (!empty($where_in)) {
            $this->db->where_in($where_in['key'], $where_in['values']);
        }

        if (!empty($limit)) {
            $this->db->limit($limit['limit'], $limit['start']);
        }

        if (!empty($group_by)) {
            $this->db->group_by($group_by);
        }

        if (!empty($order_by)) {
            $this->db->order_by($order_by['filed'], $order_by['order']);
        }

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return false;
        }
    }

    public function get_count($table, $where = FALSE, $field_rows = '*', $where_in = FALSE, $group_by = FALSE, $join_parmas = FALSE, $like = FALSE, $having = FALSE) {
        $this->db->select($field_rows)->from($table);

        if (!empty($join_parmas)) {
            foreach ($join_parmas as $join_item) {
                if (isset($join_item['type'])) {
                    $this->db->join($join_item['table'], $join_item['relation'], $join_item['type']);
                } else {
                    $this->db->join($join_item['table'], $join_item['relation']);
                }
            }
        }

        if (!empty($where)) {
            $this->db->where($where);
        }

        if (!empty($where_in)) {
            $this->db->where_in($where_in['key'], $where_in['values']);
        }

        if (!empty($like)) {
            $this->db->like($like);
        }

        if (!empty($group_by)) {
            $this->db->group_by($group_by);
        }

        if(!empty($having)){
            $this->db->having($having);
        }

        return $this->db->count_all_results();
    }

    public function haveExists($table, $where, $field_rows = '*') {
        $this->db->select($field_rows)->from($table);
        $this->db->where($where);
        return $this->db->count_all_results();
    }

    function __destruct() {
        $this->db->close();
    }

}
