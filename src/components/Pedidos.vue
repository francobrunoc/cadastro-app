<template>
    <div>
        <h1 class="mb-4">Pedidos</h1>

        <b-container>
            <div v-if="pedidos.length == 0">
                <b-container>
                    <b-alert show variant="warning">Ainda não existem pedidos cadastrados</b-alert>
                </b-container>
            </div>
            <div v-else class="h5">
                <div class="table-responsive">
                    <table class="table table-striped table-sm">
                        <thead>
                        <th>Cliente</th>
                        <th>Produtos</th>
                        <th>Total</th>
                        <th>Data</th>
                        <th></th>
                        </thead>
                        <tbody>
                        <tr v-for="p in pedidos" v-bind:key="p.id">
                            <td>{{p.cliente.nome}}</td>
                            <td>
                                <div v-for="prods in p.produtos" v-bind:key="prods.id">
                                    {{prods.nome}}
                                </div>
                            </td>
                            <td>R${{p.totalCompra}}</td>
                            <td>{{p.dataCompra | formatDate}}</td>
                            <td>
                                <b-button-group>
                                    <b-button @click="_edit(p)">
                                        <b-icon-pencil-square/>
                                    </b-button>
                                    <b-button variant="danger" @click="_delete(p)">
                                        <b-icon-trash/>
                                    </b-button>
                                </b-button-group>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </b-container>

        <b-container>
            <b-card class="shadow-sm">
                <b-button @click="_reset" v-b-tooltip title="Limpar" class="mb-4">
                    <b-icon-file-text/>
                </b-button>

                <b-form @submit.prevent="_submit">
                    <b-card-group>
                        <b-card :footer="pedido.cliente.cpf">
                            <b-form-group>
                                <autocomplete
                                        url="http://localhost:8081/cliente/findByNome"
                                        anchor="nome"
                                        label="id"
                                        ref="cliente"
                                        name="autocomplete"
                                        :classes="{ input: 'form-control', wrapper: 'input-wrapper'}"
                                        :on-select="setCliente"
                                        placeholder="Cliente">
                                    <!--:min="2">-->
                                </autocomplete>
                            </b-form-group>
                        </b-card>
                        <b-card>
                            <b-form-group>
                                <autocomplete
                                        url="http://localhost:8081/produto/findByNome"
                                        anchor="nome"
                                        label="preco"
                                        ref="produtos"
                                        name="autocomplete"
                                        :classes="{ input: 'form-control', wrapper: 'input-wrapper'}"
                                        :on-select="setProduto"
                                        placeholder="Produtos">
                                    <!--:min="2">-->
                                </autocomplete>
                                <h5 class="mt-2">X</h5>
                                <b-input type="number" min="0" number v-model="produto.quantidade"/>
                                <b-button class="mt-3" @click="addProduto" :disabled="$v.produto.$invalid" v-b-tooltip title="Incluir">
                                    <b-icon-check/>
                                </b-button>
                                <div class="mt-3 mb-3" v-for="produto in pedido.produtos" v-bind:key="produto.id">
                                    <li>{{produto.quantidade + ' x ' + produto.nome + ' - R$' + produto.preco}}
                                        <button @click="removeProduto(produto)">
                                            <b-icon-trash/>
                                        </button>
                                    </li>
                                </div>
                                <h3 class="mt-4">Total R$ {{total.toUnit()}}</h3>
                            </b-form-group>
                        </b-card>
                    </b-card-group>
                    <b-button class="mt-3" type="submit" :disabled="$v.pedido.$invalid" v-b-tooltip title="Guardar">
                        <b-icon-arrow-bar-up/>
                    </b-button>
                </b-form>
            </b-card>
        </b-container>

    </div>
</template>

<script>
    import axios from 'axios'
    import {required} from 'vuelidate/lib/validators'
    import autocomplete from 'vue2-autocomplete-js'
    import Dinero from 'dinero.js'
    import moment from 'moment'

    export default {
        name: "Pedidos",
        components: {autocomplete},
        data() {
            return {
                pedido: {
                    id: null,
                    totalCompra: null,
                    dataCompra: null,
                    cliente: {
                        id: null,
                        nome: null,
                        cpf: null
                    },
                    produtos: []
                },
                produto: {
                    id: null,
                    nome: null,
                    preco: null,
                    quantidade: 1
                },
                pedidos: [],
                total: Dinero({amount: 0, precision: 2}),
                //total: 0,
                BASE_URL_PEDIDO: 'http://localhost:8081/pedido/',
                BASE_URL_CLIENTE: 'http://localhost:8081/cliente/',
                BASE_URL_PRODUTO: 'http://localhost:8081/produto/'
            }
        },
        filters: {
            formatDate(value) {
                if (value) {
                    return moment(String(value)).format('DD/MM/YYYY')
                }
            }
        },
        methods: {
            toPrice(amount, factor = Math.pow(10, 2)) {
                return Dinero({amount: Math.round(amount * factor)})
            },
            removeProduto: function (produto) {
                for (let i = 0; i < this.pedido.produtos.length; i++) {
                    if (produto.id === this.pedido.produtos[i].id) {
                        this.pedido.produtos.splice(i, 1)
                    }
                }
                this.total = this.total.subtract(this.toPrice(produto.preco))
                this.produto = {id: null, nome: null, preco: null, quantidade: 1}
            },
            setProduto(produto) {
                this.produto = produto
                this.produto.quantidade = 1
            },
            addProduto() {
                //Define preço final do item (preço do produto vezes quantidade do produto)
                this.produto.preco = this.toPrice(this.produto.preco).multiply(this.produto.quantidade).toUnit()
                //Atualiza totalizador na tela
                this.total = this.total.add(this.toPrice(this.produto.preco))
                //Coloca produto na lista de itens escolhidos (carrinho)
                this.pedido.produtos.push(this.produto)
                //Reinicia inclusão de produto
                this.produto = {id: null, nome: null, preco: null, quantidade: 1}
                this.$refs.produtos.clearInput()
            },
            setCliente(cliente) {
                this.pedido.cliente = cliente
            },
            _list: function () {
                axios.get(this.BASE_URL_PEDIDO + 'list').then(res =>
                    this.pedidos = res.data
                ).catch(err => console.log(err));
            },
            _reset: function () {
                //Reset autocomplete inputs
                this.$refs.cliente.clearInput()
                this.$refs.produtos.clearInput()
                //Reset cliente form-group
                this.pedido.cliente = {id: null, nome: null, cpf: null}
                //Reset inserted produtos list
                this.pedido.produtos = []
                //Reset total amount
                this.total = Dinero({amount: 0})
                //Reset validator
                this.$v.$reset()
            },
            _submit: function () {
                //Configura data do pedido como a corrente
                this.pedido.dataCompra = new Date()
                //Converte para tipo compativel para API
                this.pedido.totalCompra = this.total.toUnit()
                axios.post(this.BASE_URL_PEDIDO + 'save', this.pedido).then(
                    this.postSubmit
                ).catch(err => console.log(err))
            },
            postSubmit: function () {
                this._list()
                this._reset()
            },
            _edit: function (pedido) {
                this.pedido.id = pedido.id
                this.total = this.toPrice(pedido.totalCompra)
                Object.keys(pedido.produtos).forEach(k =>
                    this.pedido.produtos[k] = pedido.produtos[k]
                )
                this.pedido.cliente = pedido.cliente
                this.$refs.cliente.setValue(pedido.cliente.nome)
                this.$refs.produtos.setValue(pedido.produtos[0].nome)
            },
            _delete: function (pedido) {
                if (confirm('Você tem certeza que deseja excluir este pedido?')) {
                    axios.delete(this.BASE_URL_PEDIDO + pedido.id).then(
                        this._list
                    ).catch(err => console.log(err));
                }
            },
            validate(name) {
                const {$dirty, $error} = this.$v.pedido[name];
                return $dirty ? !$error : null;
            }
        },
        validations: {
            pedido: {
                cliente: {
                    nome: {required},
                    id: {required}
                },
                produtos: {required},
            },
            produto: {
                id: {required}
            }
        },
        mounted: function () {
            this._list()
        }
    }
</script>

<style scoped>

</style>
