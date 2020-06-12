//Array do carrinho
let cart = [];

//Quantidade de items no modal
let modalQt = 1;

//Qual pizza está selecionada
let modalKey = 0;


//Para eu não ter que ficar colocando toda hora document.querySelector
const c = (el)=>document.querySelector(el); //Retornar o item
const cs = (el)=>document.querySelectorAll(el); //Retornar uma Array com os items que ele achar
//========================================================================================================================//


//Listagem das pizzas
pizzaJson.map((item, index)=>{
    //Clonar item
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //Selecionando a chave da pizza
    pizzaItem.setAttribute('data-key', index);

    // Preencher as informações em pizzaitem
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; //Imagem da pizza
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //Preço
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; //Nome
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; //Descrição

    //Quando clicar na tag <a> eu bloqueio à ação original da tag que é abrir um link e coloco para abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{

        //Bloquar ações originais do a
        e.preventDefault();

        //Pegar informação de qual pizza foi clicada
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //Resetar quantidade de items no modal para 1
        modalQt = 1;

        //Informar qual é a pizza
        modalKey = key;

        //Preencher informações do modal
        c('.pizzaBig img').src = pizzaJson[key].img; //Imagem da pizza
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; //Nome
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; //Descrição
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; //Preço

        //Pega item selecionado depois acessa a lista de clases e ai remove a class 'selected'
        c('.pizzaInfo--size.selected').classList.remove('selected');
        //Pegando e exibindo tamanhos das pizzas
        cs('.pizzaInfo--size').forEach((size,  sizeIndex)=>{
            //Resetar modal todas as vezes que abrir ele e selecionar o tamanho grande
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        //Animação do modal part1
        c('.pizzaWindowArea').style.opacity = 0;

        //Abrir modal quando clicar no a
        c('.pizzaWindowArea').style.display = 'flex'; //Mostrando modal

        //Animação do modal part2 - Espera um pouquinho e ai mostra o modal
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200);
    });

    //Colocar na tela
    c('.pizza-area').append( pizzaItem );
});

//Eventos do MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    //Espera meio segundo e depois fecha o modal
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//Ao clicar nos botões fecha o modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//Botão menos
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    //Se modal Qt for maior que 1 ele diminiu se não ele não faz nada
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
    
});
//Botão mais
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
})
//Selecionar os tamanhos e dentro da seleção eu aciono o evento de click
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{

    //Sempre que eu clicar em um tamanho
    size.addEventListener('click', (e)=>{
        //Ele tira a seleção de todos
        c('.pizzaInfo--size.selected').classList.remove('selected');
        //E adiciono ele
        size.classList.add('selected');
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //Pegando tamanho da pizza selecionado e transformando em um valor inteiro com o parseINT
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    //Criando identificador
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //Verificar se já tem o identifier
    let key = cart.findIndex((item)=>item.identifier == identifier);
    //Se achou eu altero o item e se não eu insiro um novo
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        //Inserindo informações no carrinho
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id, //Id da pizza
            size, //Tamanho selecionado da pizza 
            qt:modalQt //Quantidade 
        });
    }

    //Atualizar carrinho
    updateCart();

    //Fechar Modal
    closeModal ();
});

//Abrir carrinho só quando tiver algo adicionado
c('.menu-openner').addEventListener('click', ()=>{
    //Se tiver algum item
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

//Fechar carrinho ao clicar no botão
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

//Update carrinho
function updateCart() {
    //Aumentar os valores do carrinho no mobile
    c('.menu-openner span').innerHTML = cart.length;

    //Quantos items tem no carrinho e se tem item no carrinho
    if(cart.length > 0) {
        c('aside').classList.add('show');
        //zerar
        c('.cart').innerHTML = '';

        //Valores
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //mapear carrinho
        for(let i in cart) {
            //buscar
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            
            //calcular subtotais
            subtotal += pizzaItem.price * cart[i].qt;

            //clonar
            let cartItem = c('.models .cart--item').cloneNode(true);

            //tamanho da pizza par aparecer no cart
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'; //tamanho P
                    break;
                case 1:
                    pizzaSizeName = 'M'; //tamanho M
                    break;
                case 2:
                    pizzaSizeName = 'G'; //tamanho G
                    break;
            }

            //nome e tamanho da pizza par aparecer no cart
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //preenchendo as informações do cart
            cartItem.querySelector('img').src = pizzaItem.img; //Imagem da pizza
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; //Nome + tamanho
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //Quantidades de items
            // Quantidade menos
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            // Quantidade mais
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            //adicionar
            c('.cart').append(cartItem);
            
            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

        }
    } else {
        // para fechar o carrinho
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }

}